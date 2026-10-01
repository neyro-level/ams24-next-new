import { readFile } from 'node:fs/promises'
import path from 'node:path'

const configPath = path.join(process.cwd(), 'ops', 'nginx', 'ams24-site.conf.template')
const productionHeadersPath = path.join(
  process.cwd(),
  'ops',
  'nginx',
  'snippets',
  'production-security-headers.conf',
)
const stagingHeadersPath = path.join(
  process.cwd(),
  'ops',
  'nginx',
  'snippets',
  'staging-security-headers.conf',
)

const productionInclude = 'include {{NGINX_SNIPPETS_DIR}}/production-security-headers.conf;'
const stagingInclude = 'include {{NGINX_SNIPPETS_DIR}}/staging-security-headers.conf;'

const requiredPatterns = [
  ['release current root', /root\s+\{\{RELEASE_CURRENT\}\}\/out;/],
  ['production server placeholder', /server_name\s+\{\{PRODUCTION_SERVER_NAME\}\};/],
  ['staging server placeholder', /server_name\s+\{\{STAGING_SERVER_NAME\}\};/],
  ['lead proxy exact location', /location\s+=\s+\/api\/leads\s+\{/],
  ['lead proxy placeholder upstream', /proxy_pass\s+\{\{LEADS_API_UPSTREAM\}\};/],
  ['extensionless trailing slash location', /location\s+~\s+\^\/\(\?!_next\(\?:\/\|\$\)\)\(\?:\.\*\/\)\?\[\^\.\/\]\+\$\s+\{/],
  ['query-preserving permanent redirect', /return\s+301\s+\$uri\/\$is_args\$args;/],
  ['custom 404 fallback', /error_page\s+404\s+\/404\.html;/],
  ['internal 404 artifact', /location\s+=\s+\/404\.html\s+\{[\s\S]*?internal;/],
  ['public routes return real 404', /location\s+\/\s+\{[\s\S]*?try_files\s+\$uri\s+\$uri\/index\.html\s+=404;/],
  ['immutable Next assets', /location\s+\^~\s+\/_next\/static\/\s+\{[\s\S]*?Cache-Control\s+"public, max-age=31536000, immutable"/],
  ['short HTML/static cache', /location\s+\/\s+\{[\s\S]*?Cache-Control\s+"public, max-age=60"/],
  ['staging basic auth', /auth_basic\s+"AMS24 staging";[\s\S]*?auth_basic_user_file\s+\{\{STAGING_BASIC_AUTH_FILE\}\};/],
  ['Nginx snippets placeholder', /\{\{NGINX_SNIPPETS_DIR\}\}/],
]

const commonHeaderPatterns = [
  ['CSP header', /add_header\s+Content-Security-Policy\s+"/],
  ['static Next inline script policy', /script-src\s+'self'\s+'unsafe-inline'\s+https:\/\/mc\.yandex\.ru;/],
  ['nosniff header', /add_header\s+X-Content-Type-Options\s+"nosniff"\s+always;/],
  ['frame policy header', /add_header\s+X-Frame-Options\s+"SAMEORIGIN"\s+always;/],
  ['referrer policy header', /add_header\s+Referrer-Policy\s+"strict-origin-when-cross-origin"\s+always;/],
  ['permissions policy header', /add_header\s+Permissions-Policy\s+"/],
]

const forbiddenPatterns = [
  ['real http upstream', /proxy_pass\s+https?:\/\//],
  ['hardcoded production path', /\/var\/www\/ams24\/releases\/[a-zA-Z0-9._-]+/],
  ['secret-like token', /\b(?:TOKEN|SECRET|PASSWORD|API_KEY|PRIVATE_KEY)\s*[:=]/i],
  ['legacy host-rebuilding redirect', /return\s+308\s+\$scheme:\/\/\$host\$1\/;/],
  ['unsafe eval CSP capability', /(?:script-src|default-src)[^;]*'unsafe-eval'/],
]

function stripComment(line) {
  const hashIndex = line.indexOf('#')

  if (hashIndex === -1) {
    return line
  }

  return line.slice(0, hashIndex)
}

function findBraceErrors(source) {
  const errors = []
  let balance = 0

  for (const [index, rawLine] of source.split(/\r?\n/).entries()) {
    const lineNumber = index + 1
    const line = stripComment(rawLine).trim()

    if (!line) {
      continue
    }

    for (const char of line) {
      if (char === '{') {
        balance += 1
      } else if (char === '}') {
        balance -= 1
      }

      if (balance < 0) {
        errors.push(`line ${lineNumber}: closing brace without opening brace`)
        balance = 0
      }
    }

    if (!line.endsWith('{') && !line.endsWith('}') && !line.endsWith(';')) {
      errors.push(`line ${lineNumber}: directive must end with ;, { or }`)
    }
  }

  if (balance !== 0) {
    errors.push(`brace balance must be zero, got ${balance}`)
  }

  return errors
}

function extractBlocks(source, openingPattern) {
  const lines = source.split(/\r?\n/)
  const blocks = []

  for (let index = 0; index < lines.length; index += 1) {
    if (!openingPattern.test(lines[index])) {
      continue
    }

    const start = index
    let balance = 0
    do {
      const line = stripComment(lines[index])
      balance += [...line].filter((char) => char === '{').length
      balance -= [...line].filter((char) => char === '}').length
      index += 1
    } while (index < lines.length && balance > 0)

    blocks.push(lines.slice(start, index).join('\n'))
    index -= 1
  }

  return blocks
}

function validateHeaderSnippet(name, source, { staging = false } = {}) {
  const errors = findBraceErrors(source).map((error) => `${name}: ${error}`)

  for (const [headerName, pattern] of commonHeaderPatterns) {
    if (!pattern.test(source)) {
      errors.push(`${name}: missing required Nginx contract: ${headerName}`)
    }
  }

  const stagingNoindex = /add_header\s+X-Robots-Tag\s+"noindex, nofollow"\s+always;/
  if (staging && !stagingNoindex.test(source)) {
    errors.push(`${name}: missing required Nginx contract: staging noindex header`)
  }
  if (!staging && stagingNoindex.test(source)) {
    errors.push(`${name}: production headers must not force staging noindex`)
  }

  return errors
}

function validateHeaderInheritance(source) {
  const errors = []
  const serverBlocks = extractBlocks(source, /^server\s+\{/)

  for (const block of serverBlocks) {
    const staging = block.includes('server_name {{STAGING_SERVER_NAME}};')
    const expectedInclude = staging ? stagingInclude : productionInclude
    const contextName = staging ? 'staging' : 'production'

    if (!block.includes(expectedInclude)) {
      errors.push(`${contextName} server missing security-header include`)
    }

    for (const location of extractBlocks(block, /^\s*location\b.*\{/)) {
      if (location.includes('add_header') && !location.includes(expectedInclude)) {
        const firstLine = location.split(/\r?\n/, 1)[0].trim()
        errors.push(`${contextName} ${firstLine} declares add_header without security-header include`)
      }
    }
  }

  return errors
}

function analyzeNginxContract(source, snippets) {
  const errors = findBraceErrors(source)

  for (const [name, pattern] of requiredPatterns) {
    if (!pattern.test(source)) {
      errors.push(`missing required Nginx contract: ${name}`)
    }
  }

  const bundle = `${source}\n${snippets.production}\n${snippets.staging}`
  for (const [name, pattern] of forbiddenPatterns) {
    if (pattern.test(bundle)) {
      errors.push(`forbidden Nginx contract content: ${name}`)
    }
  }

  errors.push(...validateHeaderSnippet('production header snippet', snippets.production))
  errors.push(...validateHeaderSnippet('staging header snippet', snippets.staging, { staging: true }))
  errors.push(...validateHeaderInheritance(source))

  const serverBlockCount = [...source.matchAll(/^server\s+\{/gm)].length
  if (serverBlockCount !== 2) {
    errors.push(`expected exactly 2 server blocks (production and staging), got ${serverBlockCount}`)
  }

  const leadProxyCount = [...source.matchAll(/location\s+=\s+\/api\/leads\s+\{/g)].length
  if (leadProxyCount !== 2) {
    errors.push(`expected /api/leads proxy in both server blocks, got ${leadProxyCount}`)
  }

  const real404Count = [
    ...source.matchAll(/try_files\s+\$uri\s+\$uri\/index\.html\s+=404;/g),
  ].length
  if (real404Count !== 2) {
    errors.push(`expected real 404 try_files contract in both server blocks, got ${real404Count}`)
  }

  return errors
}

async function runSelfTest() {
  const valid = await readFile(configPath, 'utf8')
  const validSnippets = {
    production: await readFile(productionHeadersPath, 'utf8'),
    staging: await readFile(stagingHeadersPath, 'utf8'),
  }
  const cases = [
    ['valid baseline', valid, validSnippets, 0],
    ['missing leads proxy', valid.replaceAll(/location = \/api\/leads \{[\s\S]*?  \}/g, 'location = /api/leads_removed { return 404; }'), validSnippets, 3],
    ['missing immutable asset cache', valid.replaceAll('public, max-age=31536000, immutable', 'public, max-age=60'), validSnippets, 1],
    ['missing staging noindex', valid, { ...validSnippets, staging: validSnippets.staging.replace('add_header X-Robots-Tag "noindex, nofollow" always;', '') }, 1],
    ['missing static Next inline script policy', valid, { production: validSnippets.production.replace("'unsafe-inline' https://mc.yandex.ru", 'https://mc.yandex.ru'), staging: validSnippets.staging }, 1],
    ['unsafe eval CSP capability', valid, { production: validSnippets.production.replace("script-src 'self'", "script-src 'self' 'unsafe-eval'"), staging: validSnippets.staging }, 2],
    ['missing location security include', valid.replace(new RegExp(`    ${productionInclude.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\r?\\n    add_header Cache-Control "public, max-age=31536000, immutable" always;`), '    add_header Cache-Control "public, max-age=31536000, immutable" always;'), validSnippets, 1],
    ['redirect rewrites file-like paths', valid.replaceAll('^/(?!_next(?:/|$))(?:.*/)?[^./]+$', '^(.+[^/])$').replaceAll('return 301 $uri/$is_args$args;', 'return 308 $scheme://$host$1/;'), validSnippets, 3],
    ['redirect drops query string', valid.replaceAll('return 301 $uri/$is_args$args;', 'return 301 $uri/;'), validSnippets, 1],
    ['redirect includes Next internals', valid.replaceAll('(?!_next(?:/|$))', ''), validSnippets, 1],
    ['soft 404 fallback', valid.replaceAll('try_files $uri $uri/index.html =404;', 'try_files $uri $uri/ $uri/index.html /404.html;'), validSnippets, 2],
    ['hardcoded upstream URL', valid.replaceAll('{{LEADS_API_UPSTREAM}}', 'https://leads.internal.example'), validSnippets, 2],
    ['broken directive syntax', valid.replace('server_name {{PRODUCTION_SERVER_NAME}};', 'server_name {{PRODUCTION_SERVER_NAME}}'), validSnippets, 1],
  ]

  const failures = []
  for (const [name, source, snippets, expectedErrors] of cases) {
    const errors = analyzeNginxContract(source, snippets)
    if (errors.length !== expectedErrors) {
      failures.push(`${name}: expected ${expectedErrors} errors, got ${errors.length}: ${errors.join('; ')}`)
      continue
    }
    console.log(`Nginx contract self-test fixture "${name}": PASS (${errors.length} expected findings)`)
  }

  if (failures.length > 0) {
    console.error('Nginx contract self-test: FAIL')
    for (const failure of failures) {
      console.error(`- ${failure}`)
    }
    process.exitCode = 1
    return
  }

  console.log('Nginx contract self-test: PASS')
}

async function main() {
  if (process.argv.includes('--self-test')) {
    await runSelfTest()
    return
  }

  const source = await readFile(configPath, 'utf8')
  const snippets = {
    production: await readFile(productionHeadersPath, 'utf8'),
    staging: await readFile(stagingHeadersPath, 'utf8'),
  }
  const errors = analyzeNginxContract(source, snippets)

  if (errors.length > 0) {
    console.error('Nginx contract: FAIL')
    for (const error of errors) {
      console.error(`- ${error}`)
    }
    process.exitCode = 1
    return
  }

  console.log('Nginx contract: PASS')
}

await main()
