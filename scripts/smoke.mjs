import { createServer } from 'node:http'

export const smokeMatrix = Object.freeze({
  version: 'epic-0-v1',
  cases: [
    { id: 'home', path: '/', status: 200, headers: ['security', 'html-cache'] },
    { id: 'product-impuls', path: '/impuls/', status: 200, headers: ['security'] },
    { id: 'product-pixel', path: '/pixel/', status: 200, headers: ['security'] },
    { id: 'product-zashchita', path: '/zashchita/', status: 200, headers: ['security'] },
    { id: 'cases-hub', path: '/keisy/', status: 200, headers: ['security'] },
    { id: 'article', path: '/stati/kak-vybrat-produkt/', status: 200, headers: ['security'] },
    { id: 'knowledge', path: '/baza-znaniy/impuls/kak-podgotovit-raschet/', status: 200, headers: ['security'] },
    { id: 'canonical-redirect', path: '/kontakty?smoke=1', status: 301, location: '/kontakty/?smoke=1' },
    { id: 'real-404', path: '/__ams_smoke_missing__/', status: 404, headers: ['security', 'not-found'] },
    { id: 'public-asset-cache', path: '/favicon.ico', status: 200, headers: ['security', 'public-cache'] },
    { id: 'next-static-cache', path: { discoverNextStaticFrom: '/' }, status: 200, headers: ['security', 'immutable-cache'] },
  ],
})

const securityHeaders = [
  'content-security-policy',
  'referrer-policy',
  'x-content-type-options',
  'x-frame-options',
  'permissions-policy',
  'strict-transport-security',
]

const headerContracts = {
  security: securityHeaders.map((name) => ({ name, includes: null })),
  'html-cache': [{ name: 'cache-control', includes: 'public, max-age=60' }],
  'public-cache': [{ name: 'cache-control', includes: 'public, max-age=300' }],
  'immutable-cache': [{ name: 'cache-control', includes: 'public, max-age=31536000, immutable' }],
  'not-found': [
    { name: 'cache-control', includes: 'no-store' },
    { name: 'x-robots-tag', includes: 'noindex' },
  ],
}

function parseBaseUrl(value) {
  if (!value) throw new Error('SMOKE_CONFIG: base URL is required')
  const url = new URL(value)
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('SMOKE_CONFIG: base URL must use HTTP(S)')
  if (url.username || url.password || url.search || url.hash) throw new Error('SMOKE_CONFIG: credentials, query and fragment are forbidden in base URL')
  url.pathname = url.pathname.replace(/\/+$/, '') || '/'
  return url
}

function requestUrl(baseUrl, requestPath) {
  const base = new URL(baseUrl)
  const root = `${base.origin}${base.pathname === '/' ? '/' : `${base.pathname}/`}`
  return new URL(requestPath.replace(/^\//, ''), root)
}

async function fetchResponse(baseUrl, requestPath) {
  try {
    return await fetch(requestUrl(baseUrl, requestPath), {
      redirect: 'manual',
      signal: AbortSignal.timeout(15_000),
      headers: { 'user-agent': 'ams24-contract-smoke/epic-0-v1' },
    })
  } catch {
    const error = new Error('SMOKE_TRANSPORT: request could not reach the target')
    error.category = 'transport'
    throw error
  }
}

async function resolvePath(baseUrl, pathContract) {
  if (typeof pathContract === 'string') return pathContract
  const response = await fetchResponse(baseUrl, pathContract.discoverNextStaticFrom)
  const body = await response.text()
  const match = body.match(/["'](\/_next\/static\/[^"']+)["']/)
  if (!match) {
    const error = new Error('SMOKE_CONTRACT: home HTML does not reference a Next static asset')
    error.category = 'contract'
    throw error
  }
  return match[1]
}

function validateHeaders(response, groups) {
  const failures = []
  for (const group of groups ?? []) {
    for (const contract of headerContracts[group]) {
      const value = response.headers.get(contract.name)
      if (!value) failures.push(`missing header ${contract.name}`)
      else if (contract.includes && !value.toLowerCase().includes(contract.includes.toLowerCase())) {
        failures.push(`header ${contract.name} does not match ${group}`)
      }
    }
  }
  return failures
}

export async function runSmoke(baseUrlInput, matrix = smokeMatrix) {
  const baseUrl = parseBaseUrl(baseUrlInput)
  const results = []
  for (const testCase of matrix.cases) {
    try {
      const path = await resolvePath(baseUrl, testCase.path)
      const response = await fetchResponse(baseUrl, path)
      const failures = []
      if (response.status !== testCase.status) failures.push(`expected status ${testCase.status}, got ${response.status}`)
      if (testCase.location && response.headers.get('location') !== testCase.location) failures.push('redirect location mismatch')
      failures.push(...validateHeaders(response, testCase.headers))
      results.push({ id: testCase.id, verdict: failures.length ? 'FAIL' : 'PASS', category: failures.length ? 'contract' : null, failures })
    } catch (error) {
      results.push({ id: testCase.id, verdict: 'FAIL', category: error.category ?? 'contract', failures: [error.message] })
    }
  }
  return { matrixVersion: matrix.version, results, ok: results.every((result) => result.verdict === 'PASS') }
}

function safeReport(report) {
  console.log(`Smoke matrix ${report.matrixVersion}`)
  for (const result of report.results) {
    console.log(`${result.verdict} ${result.id}${result.category ? ` [${result.category}]` : ''}`)
    for (const failure of result.failures) console.log(`- ${failure}`)
  }
}

const fixtureSecurityHeaders = {
  'content-security-policy': "default-src 'self'",
  'referrer-policy': 'strict-origin-when-cross-origin',
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'SAMEORIGIN',
  'permissions-policy': 'camera=()',
  'strict-transport-security': 'max-age=31536000',
}

async function startFixture(mode = 'valid') {
  const htmlPaths = new Set(smokeMatrix.cases.filter(({ status }) => status === 200).map(({ path }) => typeof path === 'string' ? path : null).filter(Boolean))
  const server = createServer((request, response) => {
    for (const [name, value] of Object.entries(fixtureSecurityHeaders)) response.setHeader(name, value)
    const url = new URL(request.url, 'http://fixture.invalid')
    if (url.pathname === '/kontakty') {
      response.writeHead(301, { location: `/kontakty/${url.search}` })
      response.end()
      return
    }
    if (url.pathname === '/__ams_smoke_missing__/') {
      response.writeHead(404, { 'cache-control': 'no-store', 'x-robots-tag': 'noindex, follow' })
      response.end('missing')
      return
    }
    if (url.pathname === '/_next/static/chunks/app.js') {
      response.writeHead(200, { 'cache-control': 'public, max-age=31536000, immutable' })
      response.end('export default true')
      return
    }
    if (url.pathname === '/favicon.ico') {
      response.writeHead(200, { 'cache-control': 'public, max-age=300' })
      response.end('icon')
      return
    }
    if (htmlPaths.has(url.pathname)) {
      response.writeHead(200, { 'content-type': 'text/html', 'cache-control': mode === 'bad-cache' && url.pathname === '/' ? 'no-store' : 'public, max-age=60' })
      response.end('<script src="/_next/static/chunks/app.js"></script>')
      return
    }
    response.writeHead(404)
    response.end()
  })
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  const address = server.address()
  return { server, baseUrl: `http://127.0.0.1:${address.port}/` }
}

async function closeServer(server) {
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()))
}

async function runSelfTest() {
  const valid = await startFixture()
  const positive = await runSmoke(valid.baseUrl)
  await closeServer(valid.server)
  if (!positive.ok) throw new Error('positive fixture did not pass')

  const invalid = await startFixture('bad-cache')
  const negative = await runSmoke(invalid.baseUrl)
  await closeServer(invalid.server)
  const homeFailure = negative.results.find(({ id }) => id === 'home')
  if (negative.ok || homeFailure?.category !== 'contract') throw new Error('negative contract fixture was not classified')

  const transportMatrix = { version: 'transport-fixture-v1', cases: [{ id: 'offline', path: '/', status: 200 }] }
  const transport = await runSmoke(valid.baseUrl, transportMatrix)
  if (transport.results[0]?.category !== 'transport') throw new Error('transport failure was not classified')

  console.log('Contract smoke self-test: PASS (positive, contract mismatch, transport failure)')
}

function argumentValue(name) {
  const index = process.argv.indexOf(name)
  return index === -1 ? undefined : process.argv[index + 1]
}

if (process.argv.includes('--self-test')) {
  await runSelfTest()
} else {
  try {
    const report = await runSmoke(argumentValue('--base-url') ?? process.env.SMOKE_BASE_URL)
    safeReport(report)
    if (!report.ok) process.exitCode = report.results.some(({ category }) => category === 'transport') ? 3 : 4
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'SMOKE_CONFIG: invalid configuration')
    process.exitCode = 2
  }
}
