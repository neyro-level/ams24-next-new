import { existsSync } from 'node:fs'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const nginxImage = 'docker.io/library/nginx:1.28.0-alpine@sha256:30f1c0d78e0ad60901648be663a710bdadf19e4c10ac6782c235200619158284'
const playwrightImage = 'mcr.microsoft.com/playwright:v1.63.0-noble@sha256:eff16c30e6f3f4af0a03fa4b706120d5e9b0891c344a27d64559aff5900a4a27'
const root = process.cwd()
const outPath = path.join(root, 'out')
const resultPath = path.join(root, 'test-results', 'e2e')

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: 'utf8',
    stdio: options.inherit ? 'inherit' : 'pipe',
    maxBuffer: 20 * 1024 * 1024,
  })
  if (result.status !== 0 && !options.allowFailure) {
    const details = [result.stdout, result.stderr].filter(Boolean).join('\n').trim()
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
  for (const [placeholder, value] of Object.entries(replacements)) {
    rendered = rendered.replaceAll(placeholder, value)
  }
  const unresolved = rendered.match(/\{\{[A-Z0-9_]+\}\}/g)
  if (unresolved) throw new Error(`Unresolved Nginx placeholders: ${unresolved.join(', ')}`)
  return rendered
}

if (!existsSync(path.join(outPath, 'index.html'))) {
  throw new Error('Browser E2E requires the exact built release artifact in out/. Run pnpm verify:release or pnpm build first.')
}

const e2eMode = process.env.AMS24_E2E_MODE
if (e2eMode) {
  const isExactHeadSourceCraftRun =
    e2eMode === 'sourcecraft-no-nested-docker'
    && process.env.SOURCECRAFT_EVENT === 'manual'
    && /^[0-9a-f]{40}$/.test(process.env.EXPECTED_COMMIT_SHA ?? '')
    && process.env.SOURCECRAFT_COMMIT_SHA === process.env.EXPECTED_COMMIT_SHA

  if (!isExactHeadSourceCraftRun) {
    throw new Error(`Unsupported or unsafe AMS24_E2E_MODE: ${e2eMode}`)
  }

  console.log('Browser E2E: NOT RUN in SourceCraft (nested Docker is unavailable); exact-head build and artifact proof passed, local container E2E remains required.')
  process.exit(0)
}

const suffix = `${process.pid}-${Date.now()}`
const network = `ams24-e2e-${suffix}`
const nginxContainer = `ams24-nginx-${suffix}`
const fixturePath = await mkdtemp(path.join(os.tmpdir(), 'ams24-e2e-'))

try {
  await rm(resultPath, { recursive: true, force: true })
  await mkdir(resultPath, { recursive: true })
  await mkdir(path.join(fixturePath, 'tls'))
  await mkdir(path.join(fixturePath, 'auth'))

  const template = await readFile(path.join(root, 'ops', 'nginx', 'ams24-site.conf.template'), 'utf8')
  await writeFile(path.join(fixturePath, 'site.conf'), renderTemplate(template))
  await writeFile(
    path.join(fixturePath, 'nginx.conf'),
    'events {}\nhttp {\n  include /etc/nginx/mime.types;\n  default_type application/octet-stream;\n  sendfile on;\n  include /etc/nginx/site.conf;\n}\n',
  )
  await writeFile(path.join(fixturePath, 'auth', 'htpasswd'), 'e2e:{PLAIN}disabled\n')

  run('docker', [
    'run', '--rm',
    '--mount', bind(fixturePath, '/fixture'),
    playwrightImage,
    'bash', '-lc',
    "openssl req -x509 -newkey rsa:2048 -nodes -days 1 -subj '/CN=production.test' -addext 'subjectAltName=DNS:production.test,DNS:staging.test' -keyout /fixture/tls/site.key -out /fixture/tls/site.crt >/dev/null 2>&1",
  ])

  run('docker', ['network', 'create', network])
  run('docker', [
    'run', '--detach', '--rm',
    '--name', nginxContainer,
    '--network', network,
    '--network-alias', 'production.test',
    '--network-alias', 'staging.test',
    '--read-only',
    '--tmpfs', '/var/cache/nginx',
    '--tmpfs', '/var/run',
    '--mount', bind(outPath, '/srv/site/out', true),
    '--mount', bind(path.join(fixturePath, 'nginx.conf'), '/etc/nginx/nginx.conf', true),
    '--mount', bind(path.join(fixturePath, 'site.conf'), '/etc/nginx/site.conf', true),
    '--mount', bind(path.join(root, 'ops', 'nginx', 'snippets'), '/etc/nginx/ams24/snippets', true),
    '--mount', bind(path.join(fixturePath, 'tls'), '/etc/nginx/tls', true),
    '--mount', bind(path.join(fixturePath, 'auth'), '/etc/nginx/auth', true),
    nginxImage,
  ])
  run('docker', ['exec', nginxContainer, 'nginx', '-t'])

  const testResult = run('docker', [
    'run', '--rm',
    '--network', network,
    '--ipc=host',
    '--workdir', '/runner',
    '--env', 'CI=1',
    '--env', 'PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1',
    '--env', 'AMS24_E2E_BASE_URL=https://production.test',
    '--env', 'AMS24_E2E_OUTPUT_DIR=/artifacts',
    '--mount', bind(path.join(root, 'playwright.config.ts'), '/runner/playwright.config.ts', true),
    '--mount', bind(path.join(root, 'tests', 'e2e'), '/runner/tests/e2e', true),
    '--mount', bind(resultPath, '/artifacts'),
    playwrightImage,
    'bash', '-lc',
    `printf '{"private":true}' > package.json && npm install --no-package-lock --no-save @playwright/test@1.63.0 && npx playwright test`,
  ], { inherit: true, allowFailure: true })

  if (testResult.status !== 0) {
    throw new Error(`Browser E2E failed; concise failure artifacts are stored in ${resultPath}`)
  }

  console.log('Nginx browser E2E: PASS (exact out/ artifact, Chromium, no production access)')
} finally {
  run('docker', ['rm', '--force', nginxContainer], { allowFailure: true })
  run('docker', ['network', 'rm', network], { allowFailure: true })
  await rm(fixturePath, { recursive: true, force: true })
}
