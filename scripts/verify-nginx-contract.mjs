import { readFile } from 'node:fs/promises'
import path from 'node:path'

const configPath = path.join(process.cwd(), 'ops', 'nginx', 'ams24-site.conf.template')

const requiredPatterns = [
  ['release current root', /root\s+\{\{RELEASE_CURRENT\}\}\/out;/],
  ['production server placeholder', /server_name\s+\{\{PRODUCTION_SERVER_NAME\}\};/],
  ['staging server placeholder', /server_name\s+\{\{STAGING_SERVER_NAME\}\};/],
  ['lead proxy exact location', /location\s+=\s+\/api\/leads\s+\{/],
  ['lead proxy placeholder upstream', /proxy_pass\s+\{\{LEADS_API_UPSTREAM\}\};/],
  ['trailing slash redirect', /return\s+308\s+\$scheme:\/\/\$host\$1\/;/],
  ['custom 404 fallback', /error_page\s+404\s+\/404\.html;/],
  ['internal 404 artifact', /location\s+=\s+\/404\.html\s+\{[\s\S]*?internal;/],
  ['immutable Next assets', /location\s+\^~\s+\/_next\/static\/\s+\{[\s\S]*?Cache-Control\s+"public, max-age=31536000, immutable"/],
  ['short HTML/static cache', /location\s+\/\s+\{[\s\S]*?Cache-Control\s+"public, max-age=60"/],
  ['staging basic auth', /auth_basic\s+"AMS24 staging";[\s\S]*?auth_basic_user_file\s+\{\{STAGING_BASIC_AUTH_FILE\}\};/],
  ['staging noindex header', /add_header\s+X-Robots-Tag\s+"noindex, nofollow"\s+always;/],
  ['CSP header', /add_header\s+Content-Security-Policy\s+"/],
  ['nosniff header', /add_header\s+X-Content-Type-Options\s+"nosniff"\s+always;/],
  ['frame policy header', /add_header\s+X-Frame-Options\s+"SAMEORIGIN"\s+always;/],
  ['referrer policy header', /add_header\s+Referrer-Policy\s+"strict-origin-when-cross-origin"\s+always;/],
  ['permissions policy header', /add_header\s+Permissions-Policy\s+"/],
]

const forbiddenPatterns = [
  ['real http upstream', /proxy_pass\s+https?:\/\//],
  ['hardcoded production path', /\/var\/www\/ams24\/releases\/[a-zA-Z0-9._-]+/],
  ['secret-like token', /\b(?:TOKEN|SECRET|PASSWORD|API_KEY|PRIVATE_KEY)\s*[:=]/i],
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

function analyzeNginxContract(source) {
  const errors = findBraceErrors(source)

  for (const [name, pattern] of requiredPatterns) {
    if (!pattern.test(source)) {
      errors.push(`missing required Nginx contract: ${name}`)
    }
  }

  for (const [name, pattern] of forbiddenPatterns) {
    if (pattern.test(source)) {
      errors.push(`forbidden Nginx contract content: ${name}`)
    }
  }

  const serverBlockCount = [...source.matchAll(/^server\s+\{/gm)].length
  if (serverBlockCount !== 2) {
    errors.push(`expected exactly 2 server blocks (production and staging), got ${serverBlockCount}`)
  }

  const leadProxyCount = [...source.matchAll(/location\s+=\s+\/api\/leads\s+\{/g)].length
  if (leadProxyCount !== 2) {
    errors.push(`expected /api/leads proxy in both server blocks, got ${leadProxyCount}`)
  }

  return errors
}

async function runSelfTest() {
  const valid = await readFile(configPath, 'utf8')
  const cases = [
    ['valid baseline', valid, 0],
    ['missing leads proxy', valid.replaceAll(/location = \/api\/leads \{[\s\S]*?  \}/g, 'location = /api/leads_removed { return 404; }'), 3],
    ['missing immutable asset cache', valid.replaceAll('public, max-age=31536000, immutable', 'public, max-age=60'), 1],
    ['missing staging noindex', valid.replace('  add_header X-Robots-Tag "noindex, nofollow" always;', ''), 1],
    ['hardcoded upstream URL', valid.replaceAll('{{LEADS_API_UPSTREAM}}', 'https://leads.internal.example'), 2],
    ['broken directive syntax', valid.replace('server_name {{PRODUCTION_SERVER_NAME}};', 'server_name {{PRODUCTION_SERVER_NAME}}'), 1],
  ]

  const failures = []
  for (const [name, source, expectedErrors] of cases) {
    const errors = analyzeNginxContract(source)
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
  const errors = analyzeNginxContract(source)

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
