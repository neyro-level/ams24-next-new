import { existsSync } from 'node:fs'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const nginxImage = 'docker.io/library/nginx:1.28.0-alpine@sha256:30f1c0d78e0ad60901648be663a710bdadf19e4c10ac6782c235200619158284'
const playwrightImage = 'mcr.microsoft.com/playwright:v1.63.0-noble@sha256:eff16c30e6f3f4af0a03fa4b706120d5e9b0891c344a27d64559aff5900a4a27'
const lighthouseVersion = '13.0.1'

function argument(name) {
  const index = process.argv.indexOf(name)
  if (index < 0 || !process.argv[index + 1]) throw new Error(`${name} is required`)
  return process.argv[index + 1]
}

const checkout = path.resolve(argument('--checkout'))
const label = argument('--label')
const outputDir = path.resolve(argument('--output-dir'))
const outPath = path.join(checkout, 'out')

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: checkout,
    encoding: 'utf8',
    stdio: options.inherit ? 'inherit' : 'pipe',
    maxBuffer: 50 * 1024 * 1024,
  })
  if (result.status !== 0 && !options.allowFailure) {
    const details = [result.error?.message, result.stdout, result.stderr].filter(Boolean).join('\n').trim()
    throw new Error(`${command} ${args.join(' ')} failed with exit code ${result.status}${details ? `\n${details}` : ''}`)
  }
  return result
}

function bind(source, target, readonly = false) {
  return `type=bind,source=${source},target=${target}${readonly ? ',readonly' : ''}`
}

function renderTemplate(template) {
  const replacements = {
    '{{PRODUCTION_SERVER_NAME}}': 'production.test',
    '{{STAGING_SERVER_NAME}}': 'staging.test',
    '{{PRODUCTION_CERTIFICATE}}': '/etc/nginx/tls/site.crt',
    '{{PRODUCTION_CERTIFICATE_KEY}}': '/etc/nginx/tls/site.key',
    '{{STAGING_CERTIFICATE}}': '/etc/nginx/tls/site.crt',
    '{{STAGING_CERTIFICATE_KEY}}': '/etc/nginx/tls/site.key',
    '{{RELEASE_CURRENT}}': '/srv/site',
    '{{NGINX_SNIPPETS_DIR}}': '/etc/nginx/ams24/snippets',
    '{{LEADS_API_UPSTREAM}}': 'http://127.0.0.1:9',
    '{{STAGING_LEADS_API_UPSTREAM}}': 'http://127.0.0.1:9',
    '{{STAGING_BASIC_AUTH_FILE}}': '/etc/nginx/auth/htpasswd',
  }

  let rendered = template
  for (const [placeholder, value] of Object.entries(replacements)) rendered = rendered.replaceAll(placeholder, value)
  const unresolved = rendered.match(/\{\{[A-Z0-9_]+\}\}/g)
  if (unresolved) throw new Error(`Unresolved Nginx placeholders: ${unresolved.join(', ')}`)
  return rendered
}

if (!existsSync(path.join(outPath, 'index.html'))) throw new Error(`Missing built artifact: ${outPath}`)

const checkoutSha = run('git', ['rev-parse', 'HEAD']).stdout.trim()

const suffix = `${process.pid}-${Date.now()}`
const network = `ams24-lighthouse-${suffix}`
const container = `ams24-lighthouse-${suffix}`
const fixturePath = await mkdtemp(path.join(os.tmpdir(), 'ams24-lighthouse-'))

try {
  await mkdir(outputDir, { recursive: true })
  await mkdir(path.join(fixturePath, 'tls'))
  await mkdir(path.join(fixturePath, 'auth'))
  const template = await readFile(path.join(checkout, 'ops', 'nginx', 'ams24-site.conf.template'), 'utf8')
  await writeFile(path.join(fixturePath, 'site.conf'), renderTemplate(template))
  await writeFile(
    path.join(fixturePath, 'nginx.conf'),
    'events {}\nhttp {\n  include /etc/nginx/mime.types;\n  default_type application/octet-stream;\n  sendfile on;\n  include /etc/nginx/site.conf;\n}\n',
  )
  await writeFile(path.join(fixturePath, 'auth', 'htpasswd'), 'lighthouse:{PLAIN}disabled\n')

  run('docker', [
    'run', '--rm', '--mount', bind(fixturePath, '/fixture'), playwrightImage, 'bash', '-lc',
    "openssl req -x509 -newkey rsa:2048 -nodes -days 1 -subj '/CN=production.test' -addext 'subjectAltName=DNS:production.test,DNS:staging.test' -keyout /fixture/tls/site.key -out /fixture/tls/site.crt >/dev/null 2>&1",
  ])

  run('docker', ['network', 'create', network])
  run('docker', [
    'run', '--detach', '--rm', '--name', container, '--network', network,
    '--network-alias', 'production.test', '--network-alias', 'staging.test', '--read-only',
    '--tmpfs', '/var/cache/nginx', '--tmpfs', '/var/run',
    '--mount', bind(outPath, '/srv/site/out', true),
    '--mount', bind(path.join(fixturePath, 'nginx.conf'), '/etc/nginx/nginx.conf', true),
    '--mount', bind(path.join(fixturePath, 'site.conf'), '/etc/nginx/site.conf', true),
    '--mount', bind(path.join(checkout, 'ops', 'nginx', 'snippets'), '/etc/nginx/ams24/snippets', true),
    '--mount', bind(path.join(fixturePath, 'tls'), '/etc/nginx/tls', true),
    '--mount', bind(path.join(fixturePath, 'auth'), '/etc/nginx/auth', true),
    nginxImage,
  ])
  run('docker', ['exec', container, 'nginx', '-t'])

  const routes = [
    { slug: 'home', path: '/' },
    { slug: 'impuls', path: '/impuls/' },
  ]
  const results = []

  for (const route of routes) {
    const reportPath = path.join(outputDir, `${label}-${route.slug}.report.json`)
    const artifactName = path.basename(reportPath)
    const url = `https://production.test${route.path}`
    const lighthouseCommand = [
      'export CHROME_PATH=/ms-playwright/chromium-1243/chrome-linux64/chrome;',
      `npm exec --yes --package=lighthouse@${lighthouseVersion} -- lighthouse '${url}'`,
      '--preset=perf --form-factor=mobile --throttling-method=simulate',
      '--screenEmulation.mobile=true --screenEmulation.width=390 --screenEmulation.height=844',
      '--screenEmulation.deviceScaleFactor=3 --output=json',
      `--output-path='/artifacts/${artifactName}' --quiet`,
      `--chrome-flags='--headless=new --no-sandbox --disable-gpu --ignore-certificate-errors'`,
    ].join(' ')
    run('docker', [
      'run', '--rm', '--network', network, '--ipc=host',
      '--mount', bind(outputDir, '/artifacts'),
      playwrightImage, 'bash', '-lc', lighthouseCommand,
    ], { inherit: true })

    const reportSource = await readFile(reportPath, 'utf8')
    const report = JSON.parse(reportSource)
    results.push({
      route: route.path,
      url,
      performanceScore: report.categories.performance.score,
      fcpMs: report.audits['first-contentful-paint'].numericValue,
      lcpMs: report.audits['largest-contentful-paint'].numericValue,
      cls: report.audits['cumulative-layout-shift'].numericValue,
      tbtMs: report.audits['total-blocking-time'].numericValue,
      speedIndexMs: report.audits['speed-index'].numericValue,
      totalByteWeight: report.audits['total-byte-weight'].numericValue,
      lighthouseVersion: report.lighthouseVersion,
      userAgent: report.userAgent,
    })
  }

  const summary = {
    label,
    checkoutSha,
    profile: {
      preset: 'perf',
      formFactor: 'mobile',
      throttlingMethod: 'simulate',
      viewport: '390x844@3x',
      lighthouseVersion,
      nginxImage,
      playwrightImage,
    },
    results,
  }
  await writeFile(path.join(outputDir, `${label}-summary.json`), `${JSON.stringify(summary, null, 2)}\n`)
  console.log(JSON.stringify({ label, results }, null, 2))
} finally {
  run('docker', ['rm', '--force', container], { allowFailure: true })
  run('docker', ['network', 'rm', network], { allowFailure: true })
  await rm(fixturePath, { recursive: true, force: true })
}
