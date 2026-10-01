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
  ['HTTP to HTTPS redirect', /return\s+301\s+https:\/\/\$host\$request_uri;/],
  ['HTTPS listener', /listen\s+443\s+ssl;/],
  ['HTTP2 enablement', /http2\s+on;/],
]

const commonHeaderPatterns = [
  ['CSP header', /add_header\s+Content-Security-Policy\s+"/],
  ['static Next inline script policy', /script-src\s+'self'\s+'unsafe-inline'\s+https:\/\/mc\.yandex\.ru;/],
  ['nosniff header', /add_header\s+X-Content-Type-Options\s+"nosniff"\s+always;/],
  ['frame policy header', /add_header\s+X-Frame-Options\s+"SAMEORIGIN"\s+always;/],
  ['referrer policy header', /add_header\s+Referrer-Policy\s+"strict-origin-when-cross-origin"\s+always;/],
  ['permissions policy header', /add_header\s+Permissions-Policy\s+"/],
  ['one-year HSTS header', /add_header\s+Strict-Transport-Security\s+"max-age=31536000"\s+always;/],
]

const forbiddenPatterns = [
  ['real http upstream', /proxy_pass\s+https?:\/\//],
  ['hardcoded production path', /\/var\/www\/ams24\/releases\/[a-zA-Z0-9._-]+/],
  ['secret-like token', /\b(?:TOKEN|SECRET|PASSWORD|API_KEY|PRIVATE_KEY)\s*[:=]/i],
  ['legacy host-rebuilding redirect', /return\s+308\s+\$scheme:\/\/\$host\$1\/;/],
  ['unsafe eval CSP capability', /(?:script-src|default-src)[^;]*'unsafe-eval'/],
  ['broad HSTS scope', /Strict-Transport-Security\s+"[^"]*(?:includeSubDomains|preload)[^"]*"/i],
  ['hardcoded certificate path', /ssl_certificate(?:_key)?\s+(?!\{\{(?:PRODUCTION|STAGING)_CERTIFICATE(?:_KEY)?\}\})[^;]+;/],
  ['speculative Brotli configuration', /\bbrotli(?:_static|_types)?\s+/i],
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
    if (!/listen\s+443\s+ssl;/.test(block)) {
      continue
    }

    const staging = block.includes('server_name {{STAGING_SERVER_NAME}};')
    const expectedInclude = staging ? stagingInclude : productionInclude
    const contextName = staging ? 'staging' : 'production'

    if (!block.includes(expectedInclude)) {
      errors.push(`${contextName} server missing security-header include`)
    }

    for (const location of extractBlocks(block, /^\s*location\b.*\{/)) {
      if (location.includes('add_header') && !location.includes(expectedInclude)) {
        const firstLine = location.split(/\r?\n/, 1)[0].trim()
        const consequence = staging ? ' and loses X-Robots-Tag' : ''
        errors.push(
          `${contextName} ${firstLine} declares add_header without security-header include${consequence}`,
        )
      }
    }
  }

  return errors
}

function validateRouteSemantics(source) {
  const errors = []
  const httpsServers = extractBlocks(source, /^server\s+\{/).filter((block) =>
    /listen\s+443\s+ssl;/.test(block),
  )
  const canonicalMatcher =
    /^\s*location\s+~\s+\^\/\(\?!_next\(\?:\/\|\$\)\)\(\?:\.\*\/\)\?\[\^\.\/\]\+\$\s+\{/

  for (const block of httpsServers) {
    const contextName = block.includes('server_name {{STAGING_SERVER_NAME}};')
      ? 'staging'
      : 'production'
    const locations = extractBlocks(block, /^\s*location\b.*\{/)
    const slashLocations = locations.filter((location) =>
      /return\s+\d+\s+\$uri\//.test(location),
    )

    if (slashLocations.length !== 1 || !canonicalMatcher.test(slashLocations[0] ?? '')) {
      errors.push(
        `${contextName} trailing-slash matcher must exclude files and /_next/ routes`,
      )
    }

    const slashRedirect = slashLocations[0] ?? ''
    if (!/return\s+301\s+\$uri\/\$is_args\$args;/.test(slashRedirect)) {
      if (!/return\s+301\s+/.test(slashRedirect)) {
        errors.push(`${contextName} trailing-slash redirect must use status 301`)
      }
      if (!/\$is_args\$args;/.test(slashRedirect)) {
        errors.push(`${contextName} trailing-slash redirect must preserve query arguments`)
      }
    }

    const publicLocation = locations.find((location) => /^\s*location\s+\/\s+\{/.test(location))
    if (!publicLocation || !/try_files\s+\$uri\s+\$uri\/index\.html\s+=404;/.test(publicLocation)) {
      errors.push(`${contextName} public try_files must end in =404, not a URI fallback`)
    }
  }

  return errors
}

function validateCacheAndCompression(source) {
  const errors = []
  const httpsServers = extractBlocks(source, /^server\s+\{/).filter((block) =>
    /listen\s+443\s+ssl;/.test(block),
  )
  const requiredTypes = ['text/plain', 'text/css', 'application/javascript', 'application/xml', 'text/xml', 'image/svg+xml']

  for (const block of httpsServers) {
    const staging = block.includes('server_name {{STAGING_SERVER_NAME}};')
    const name = staging ? 'staging' : 'production'
    const expectedInclude = staging ? stagingInclude : productionInclude
    const locations = extractBlocks(block, /^\s*location\b.*\{/).filter((location) =>
      /\(\?:ico\|svg\|webp\)/.test(location),
    )
    const location = locations[0] ?? ''
    if (locations.length !== 1 || !location.includes(expectedInclude)) errors.push(`${name} must define one header-safe public asset cache location`)
    if (!/Cache-Control\s+"public, max-age=300"\s+always;/.test(location)) errors.push(`${name} unhashed public assets must use short cache without immutable`)
    if (/Cache-Control\s+"[^"]*immutable/.test(location)) errors.push(`${name} unhashed public assets must not use immutable caching`)
    if (!/gzip\s+on;/.test(block) || !/gzip_static\s+on;/.test(block) || !/gzip_vary\s+on;/.test(block)) errors.push(`${name} must enable gzip, gzip_static and gzip_vary`)
    const types = (block.match(/gzip_types\s+([^;]+);/)?.[1] ?? '').split(/\s+/)
    for (const type of requiredTypes) if (!types.includes(type)) errors.push(`${name} gzip_types must include ${type}`)
  }
  return errors
}

function validateTlsRoles(source) {
  const errors = []
  const serverBlocks = extractBlocks(source, /^server\s+\{/)
  const roles = [
    ['production', '{{PRODUCTION_SERVER_NAME}}', '{{PRODUCTION_CERTIFICATE}}', '{{PRODUCTION_CERTIFICATE_KEY}}'],
    ['staging', '{{STAGING_SERVER_NAME}}', '{{STAGING_CERTIFICATE}}', '{{STAGING_CERTIFICATE_KEY}}'],
  ]

  for (const [name, serverName, certificate, certificateKey] of roles) {
    const matching = serverBlocks.filter((block) => block.includes(`server_name ${serverName};`))
    const http = matching.filter((block) => /listen\s+80;/.test(block))
    const https = matching.filter((block) => /listen\s+443\s+ssl;/.test(block))

    if (http.length !== 1 || !/return\s+301\s+https:\/\/\$host\$request_uri;/.test(http[0] ?? '')) {
      errors.push(`${name} must have exactly one redirect-only HTTP server`)
    }
    if (http[0] && /\b(?:root|ssl_certificate|add_header|include\s+\{\{NGINX_SNIPPETS_DIR\}\})\b/.test(http[0])) {
      errors.push(`${name} HTTP redirect server must not contain application, TLS or security-header directives`)
    }
    if (https.length !== 1 || !/http2\s+on;/.test(https[0] ?? '')) {
      errors.push(`${name} must have exactly one HTTP2 HTTPS application server`)
    }
    if (!https[0]?.includes(`ssl_certificate ${certificate};`) || !https[0]?.includes(`ssl_certificate_key ${certificateKey};`)) {
      errors.push(`${name} HTTPS server must use certificate placeholders`)
    }
  }

  return errors
}

function validateLeadIsolation(source) {
  const errors = []
  const servers = extractBlocks(source, /^server\s+\{/).filter((block) => /listen\s+443\s+ssl;/.test(block))
  const production = servers.find((block) => block.includes('server_name {{PRODUCTION_SERVER_NAME}};')) ?? ''
  const staging = servers.find((block) => block.includes('server_name {{STAGING_SERVER_NAME}};')) ?? ''
  const leadLocation = (block) => extractBlocks(block, /^\s*location\s+=\s+\/api\/leads\s+\{/)[0] ?? ''
  const productionLead = leadLocation(production)
  const stagingLead = leadLocation(staging)

  if (!productionLead.includes('proxy_pass {{LEADS_API_UPSTREAM}};')) errors.push('production leads proxy must use production upstream placeholder')
  if (!stagingLead.includes('proxy_pass {{STAGING_LEADS_API_UPSTREAM}};')) errors.push('staging leads proxy must use distinct staging upstream placeholder')
  if (!staging.includes(stagingInclude) || (stagingLead.includes('add_header') && !stagingLead.includes(stagingInclude))) {
    errors.push('staging leads proxy must preserve staging noindex header inheritance')
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
  errors.push(...validateRouteSemantics(source))
  errors.push(...validateCacheAndCompression(source))
  errors.push(...validateTlsRoles(source))
  errors.push(...validateLeadIsolation(source))

  const serverBlockCount = [...source.matchAll(/^server\s+\{/gm)].length
  if (serverBlockCount !== 4) {
    errors.push(`expected exactly 4 server blocks (HTTP redirect and HTTPS application per host), got ${serverBlockCount}`)
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
  const removeLocationInclude = (source, include) =>
    source.replace(
      new RegExp(
        `    ${include.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\r?\\n    add_header Cache-Control "public, max-age=31536000, immutable" always;`,
      ),
      '    add_header Cache-Control "public, max-age=31536000, immutable" always;',
    )

  const cases = [
    { name: 'valid baseline', source: valid, snippets: validSnippets, expected: [] },
    {
      name: 'staging leads share production upstream',
      source: valid.replace('proxy_pass {{STAGING_LEADS_API_UPSTREAM}};', 'proxy_pass {{LEADS_API_UPSTREAM}};'),
      snippets: validSnippets,
      expected: ['staging leads proxy must use distinct staging upstream placeholder'],
    },
    {
      name: 'missing leads proxy',
      source: valid.replaceAll(
        /location = \/api\/leads \{[\s\S]*?  \}/g,
        'location = /api/leads_removed { return 404; }',
      ),
      snippets: validSnippets,
      expected: ['missing required Nginx contract: lead proxy exact location'],
    },
    {
      name: 'missing immutable asset cache',
      source: valid.replaceAll('public, max-age=31536000, immutable', 'public, max-age=60'),
      snippets: validSnippets,
      expected: ['missing required Nginx contract: immutable Next assets'],
    },
    {
      name: 'missing staging noindex',
      source: valid,
      snippets: {
        ...validSnippets,
        staging: validSnippets.staging.replace(
          'add_header X-Robots-Tag "noindex, nofollow" always;',
          '',
        ),
      },
      expected: ['staging header snippet: missing required Nginx contract: staging noindex header'],
    },
    {
      name: 'unsafe eval CSP capability',
      source: valid,
      snippets: {
        production: validSnippets.production.replace(
          "script-src 'self'",
          "script-src 'self' 'unsafe-eval'",
        ),
        staging: validSnippets.staging,
      },
      expected: ['forbidden Nginx contract content: unsafe eval CSP capability'],
    },
    {
      name: 'missing HSTS',
      source: valid,
      snippets: {
        production: validSnippets.production.replace(
          'add_header Strict-Transport-Security "max-age=31536000" always;',
          '',
        ),
        staging: validSnippets.staging,
      },
      expected: ['production header snippet: missing required Nginx contract: one-year HSTS header'],
    },
    {
      name: 'forbidden HSTS preload',
      source: valid,
      snippets: {
        production: validSnippets.production.replace(
          'max-age=31536000',
          'max-age=31536000; includeSubDomains; preload',
        ),
        staging: validSnippets.staging,
      },
      expected: ['forbidden Nginx contract content: broad HSTS scope'],
    },
    {
      name: 'hardcoded certificate path',
      source: valid.replace(
        'ssl_certificate {{PRODUCTION_CERTIFICATE}};',
        'ssl_certificate /etc/ssl/private/example.pem;',
      ),
      snippets: validSnippets,
      expected: ['forbidden Nginx contract content: hardcoded certificate path'],
    },
    {
      name: 'location add_header without security include',
      source: removeLocationInclude(valid, productionInclude),
      snippets: validSnippets,
      expected: ['production location ^~ /_next/static/ { declares add_header without security-header include'],
    },
    {
      name: 'staging location loses X-Robots-Tag',
      source: removeLocationInclude(valid, stagingInclude),
      snippets: validSnippets,
      expected: ['staging location ^~ /_next/static/ { declares add_header without security-header include and loses X-Robots-Tag'],
    },
    {
      name: 'public try_files URI fallback',
      source: valid.replaceAll(
        'try_files $uri $uri/index.html =404;',
        'try_files $uri $uri/index.html /404.html;',
      ),
      snippets: validSnippets,
      expected: ['production public try_files must end in =404, not a URI fallback', 'staging public try_files must end in =404, not a URI fallback'],
    },
    {
      name: 'trailing-slash matcher includes files',
      source: valid.replaceAll('^/(?!_next(?:/|$))(?:.*/)?[^./]+$', '^/(?!_next(?:/|$)).+[^/]$'),
      snippets: validSnippets,
      expected: ['production trailing-slash matcher must exclude files and /_next/ routes', 'staging trailing-slash matcher must exclude files and /_next/ routes'],
    },
    {
      name: 'trailing-slash matcher includes Next internals',
      source: valid.replaceAll('(?!_next(?:/|$))', ''),
      snippets: validSnippets,
      expected: ['production trailing-slash matcher must exclude files and /_next/ routes', 'staging trailing-slash matcher must exclude files and /_next/ routes'],
    },
    {
      name: 'trailing-slash redirect is not 301',
      source: valid.replaceAll('return 301 $uri/$is_args$args;', 'return 308 $uri/$is_args$args;'),
      snippets: validSnippets,
      expected: ['production trailing-slash redirect must use status 301', 'staging trailing-slash redirect must use status 301'],
    },
    {
      name: 'trailing-slash redirect drops query arguments',
      source: valid.replaceAll('return 301 $uri/$is_args$args;', 'return 301 $uri/;'),
      snippets: validSnippets,
      expected: ['production trailing-slash redirect must preserve query arguments', 'staging trailing-slash redirect must preserve query arguments'],
    },
    {
      name: 'CSP loses static Next inline script strategy',
      source: valid,
      snippets: {
        production: validSnippets.production.replace("'unsafe-inline' https://mc.yandex.ru", 'https://mc.yandex.ru'),
        staging: validSnippets.staging,
      },
      expected: ['production header snippet: missing required Nginx contract: static Next inline script policy'],
    },
    {
      name: 'hardcoded upstream URL',
      source: valid.replaceAll('{{LEADS_API_UPSTREAM}}', 'https://leads.internal.example'),
      snippets: validSnippets,
      expected: ['forbidden Nginx contract content: real http upstream'],
    },
    {
      name: 'unhashed public assets lose short cache',
      source: valid.replaceAll('public, max-age=300', 'public, max-age=60'),
      snippets: validSnippets,
      expected: ['production unhashed public assets must use short cache without immutable', 'staging unhashed public assets must use short cache without immutable'],
    },
    {
      name: 'unhashed public assets become immutable',
      source: valid.replaceAll('public, max-age=300', 'public, max-age=31536000, immutable'),
      snippets: validSnippets,
      expected: ['production unhashed public assets must not use immutable caching', 'staging unhashed public assets must not use immutable caching'],
    },
    {
      name: 'gzip_static is disabled',
      source: valid.replaceAll('gzip_static on;', ''),
      snippets: validSnippets,
      expected: ['production must enable gzip, gzip_static and gzip_vary', 'staging must enable gzip, gzip_static and gzip_vary'],
    },
    {
      name: 'SVG gzip type is missing',
      source: valid.replaceAll(' image/svg+xml;', ';'),
      snippets: validSnippets,
      expected: ['production gzip_types must include image/svg+xml', 'staging gzip_types must include image/svg+xml'],
    },
    {
      name: 'speculative Brotli is configured',
      source: valid.replace('gzip on;', 'gzip on;\n  brotli on;'),
      snippets: validSnippets,
      expected: ['forbidden Nginx contract content: speculative Brotli configuration'],
    },
    {
      name: 'broken directive syntax',
      source: valid.replace('charset utf-8;', 'charset utf-8'),
      snippets: validSnippets,
      expected: ['line 23: directive must end with ;, { or }'],
    },
  ]

  const failures = []
  for (const { name, source, snippets, expected } of cases) {
    const errors = analyzeNginxContract(source, snippets)
    const missing = expected.filter((finding) => !errors.includes(finding))
    if (missing.length > 0 || (expected.length === 0 && errors.length > 0)) {
      failures.push(
        `${name}: missing intended findings [${missing.join('; ')}]; actual findings: ${errors.join('; ')}`,
      )
      continue
    }
    console.log(
      `Nginx contract self-test fixture "${name}": PASS (${expected.length} intended findings proved)`,
    )
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
