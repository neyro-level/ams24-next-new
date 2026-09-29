import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const artifactDir = join(process.cwd(), 'out')

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

for (const file of textFiles) {
  const content = readFileSync(file, 'utf8')

  for (const pattern of forbiddenPatterns) {
    if (pattern.test(content)) {
      findings.push(`${file}: ${pattern}`)
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

