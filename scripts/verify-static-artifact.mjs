import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { gunzipSync } from 'node:zlib'

const artifactDir = join(process.cwd(), 'out')
const sitemapPath = join(artifactDir, 'sitemap.xml')
const robotsPath = join(artifactDir, 'robots.txt')
const expectedSitemapUrls = [
  'https://ams24.ru/',
  'https://ams24.ru/impuls/',
  'https://ams24.ru/pixel/',
  'https://ams24.ru/zashchita/',
]
const expectedIndexableHtml = [
  { path: '/', url: 'https://ams24.ru/', h1: 'Импульс' },
  {
    path: '/impuls/',
    url: 'https://ams24.ru/impuls/',
    h1: 'Импульс — лидогенерация для бизнеса',
  },
  {
    path: '/pixel/',
    url: 'https://ams24.ru/pixel/',
    h1: 'Импульс Пиксель — определить заинтересованных посетителей сайта',
  },
  {
    path: '/zashchita/',
    url: 'https://ams24.ru/zashchita/',
    h1: 'Импульс Защита — аудит риска перехвата лидов',
  },
]
const expectedNoindexHtml = [
  '/tarify/',
  '/raschety/',
  '/keisy/',
  '/keisy/medical-case/',
  '/otzyvy/',
  '/kontakty/',
  '/politika/',
  '/soglasie/',
  '/obrabotka-dannyh/',
  '/stati/',
  '/stati/kak-vybrat-produkt/',
  '/baza-znaniy/',
  '/baza-znaniy/impuls/kak-podgotovit-raschet/',
  '/o-kompanii/',
  '/rekvizity/',
]

const forbiddenPatterns = [
  /SOURCECRAFT_PAT\s*=/i,
  /GITHUB_TOKEN\s*=/i,
  /DATABASE_URL\s*=/i,
  /INFISICAL_TOKEN\s*=/i,
  /SECRET_MASTER/i,
  /secretValue/i,
  /-----BEGIN (?:RSA |OPENSSH |EC |)PRIVATE KEY-----/,
]

const textExtensions = new Set([
  '.css',
  '.html',
  '.js',
  '.json',
  '.map',
  '.svg',
  '.txt',
  '.xml',
])

function extensionOf(filePath) {
  const index = filePath.lastIndexOf('.')
  return index >= 0 ? filePath.slice(index).toLowerCase() : ''
}

function walk(dir) {
  const entries = readdirSync(dir)
  const files = []

  for (const entry of entries) {
    const absolute = join(dir, entry)
    const stats = statSync(absolute)

    if (stats.isDirectory()) {
      files.push(...walk(absolute))
      continue
    }

    if (stats.isFile()) {
      files.push(absolute)
    }
  }

  return files
}

if (!existsSync(artifactDir)) {
  console.error('Static artifact guard: FAIL — out/ directory does not exist. Run next build first.')
  process.exit(1)
}

const textFiles = walk(artifactDir).filter((file) => textExtensions.has(extensionOf(file)))
const findings = []

for (const file of textFiles.filter((candidate) =>
  ['.css', '.html', '.js', '.svg', '.txt', '.xml'].includes(extensionOf(candidate)),
)) {
  const compressed = `${file}.gz`
  if (!existsSync(compressed)) {
    findings.push(`precompressed artifact is missing: ${compressed.slice(artifactDir.length + 1)}`)
    continue
  }
  try {
    if (!gunzipSync(readFileSync(compressed)).equals(readFileSync(file))) {
      findings.push(`precompressed artifact does not round-trip: ${compressed.slice(artifactDir.length + 1)}`)
    }
  } catch {
    findings.push(`precompressed artifact is invalid gzip: ${compressed.slice(artifactDir.length + 1)}`)
  }
}
if (!existsSync(sitemapPath)) {
  findings.push('out/sitemap.xml is required for static SEO artifact proof')
}

function htmlPathFor(routePath) {
  if (routePath === '/') {
    return join(artifactDir, 'index.html')
  }

  return join(artifactDir, ...routePath.split('/').filter(Boolean), 'index.html')
}

function requireHtmlContains(filePath, html, expected) {
  if (!html.includes(expected)) {
    findings.push(`${filePath} is missing expected HTML fragment: ${expected}`)
  }
}

if (!existsSync(robotsPath)) {
  findings.push('out/robots.txt is required for static SEO artifact proof')
}

for (const file of textFiles) {
  const content = readFileSync(file, 'utf8')

  for (const pattern of forbiddenPatterns) {
    if (pattern.test(content)) {
      findings.push(`${file}: ${pattern}`)
    }
  }
}

if (existsSync(sitemapPath)) {
  const sitemap = readFileSync(sitemapPath, 'utf8')

  for (const url of expectedSitemapUrls) {
    if (!sitemap.includes(`<loc>${url}</loc>`)) {
      findings.push(`out/sitemap.xml is missing expected indexable URL ${url}`)
    }
  }

  for (const routePath of expectedNoindexHtml) {
    const url = new URL(routePath, 'https://ams24.ru').toString()

    if (sitemap.includes(`<loc>${url}</loc>`)) {
      findings.push(`out/sitemap.xml must not include noindex or unfinished URL ${url}`)
    }
  }
}

if (existsSync(robotsPath)) {
  const robots = readFileSync(robotsPath, 'utf8')

  for (const line of ['User-Agent: *', 'Allow: /', 'Sitemap: https://ams24.ru/sitemap.xml', 'Host: https://ams24.ru']) {
    if (!robots.includes(line)) {
      findings.push(`out/robots.txt is missing "${line}"`)
    }
  }
}

for (const page of expectedIndexableHtml) {
  const filePath = htmlPathFor(page.path)

  if (!existsSync(filePath)) {
    findings.push(`${filePath} is required for indexable route ${page.path}`)
    continue
  }

  const html = readFileSync(filePath, 'utf8')

  requireHtmlContains(filePath, html, `<link rel="canonical" href="${page.url}"/>`)
  requireHtmlContains(filePath, html, '<meta name="robots" content="index, follow"/>')
  requireHtmlContains(filePath, html, `<meta property="og:url" content="${page.url}"/>`)
  requireHtmlContains(filePath, html, '<meta property="og:site_name" content="Импульс"/>')
  requireHtmlContains(filePath, html, '<meta property="og:type" content="website"/>')
  requireHtmlContains(filePath, html, page.h1)
}

for (const routePath of expectedNoindexHtml) {
  const filePath = htmlPathFor(routePath)
  const url = new URL(routePath, 'https://ams24.ru').toString()

  if (!existsSync(filePath)) {
    findings.push(`${filePath} is required for noindex route ${routePath}`)
    continue
  }

  const html = readFileSync(filePath, 'utf8')

  requireHtmlContains(filePath, html, `<link rel="canonical" href="${url}"/>`)
  requireHtmlContains(filePath, html, '<meta name="robots" content="noindex, follow"/>')
  requireHtmlContains(filePath, html, `<meta property="og:url" content="${url}"/>`)
  requireHtmlContains(filePath, html, '<meta property="og:site_name" content="Импульс"/>')
}

if (findings.length > 0) {
  console.error('Static artifact guard: FAIL')
  for (const finding of findings) {
    console.error(`- ${finding}`)
  }
  process.exit(1)
}

console.log(`Static artifact guard: PASS (${textFiles.length} text files scanned)`)

