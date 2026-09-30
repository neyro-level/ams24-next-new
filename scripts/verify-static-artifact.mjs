import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const artifactDir = join(process.cwd(), 'out')
const sitemapPath = join(artifactDir, 'sitemap.xml')
const robotsPath = join(artifactDir, 'robots.txt')
const expectedSitemapUrls = [
  'https://ams24.ru/',
  'https://ams24.ru/impuls/',
  'https://ams24.ru/pixel/',
  'https://ams24.ru/zashchita/',
]
const excludedSitemapUrls = [
  'https://ams24.ru/tarify/',
  'https://ams24.ru/raschety/',
  'https://ams24.ru/keisy/',
  'https://ams24.ru/otzyvy/',
  'https://ams24.ru/kontakty/',
  'https://ams24.ru/politika/',
  'https://ams24.ru/soglasie/',
  'https://ams24.ru/obrabotka-dannyh/',
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

if (!existsSync(sitemapPath)) {
  findings.push('out/sitemap.xml is required for static SEO artifact proof')
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

  for (const url of excludedSitemapUrls) {
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

if (findings.length > 0) {
  console.error('Static artifact guard: FAIL')
  for (const finding of findings) {
    console.error(`- ${finding}`)
  }
  process.exit(1)
}

console.log(`Static artifact guard: PASS (${textFiles.length} text files scanned)`)

