import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { extname, join, relative, sep } from 'node:path'
import { gunzipSync } from 'node:zlib'

const manifestName = 'ams-routes.json'
const compressedExtensions = new Set(['.css', '.html', '.js', '.svg', '.txt', '.xml'])
const scannedExtensions = new Set([...compressedExtensions, '.json', '.map'])
const forbiddenPatterns = [
  /SOURCECRAFT_PAT\s*=/i,
  /GITHUB_TOKEN\s*=/i,
  /DATABASE_URL\s*=/i,
  /INFISICAL_TOKEN\s*=/i,
  /SECRET_MASTER/i,
  /secretValue/i,
  /-----BEGIN (?:RSA |OPENSSH |EC |)PRIVATE KEY-----/,
]

function walk(directory) {
  if (!existsSync(directory)) return []
  const files = []
  for (const entry of readdirSync(directory)) {
    const absolute = join(directory, entry)
    const stats = statSync(absolute)
    if (stats.isDirectory()) files.push(...walk(absolute))
    else if (stats.isFile()) files.push(absolute)
  }
  return files
}

function artifactFileForRoute(artifactDir, routePath) {
  if (routePath === '/') return join(artifactDir, 'index.html')
  return join(artifactDir, ...routePath.split('/').filter(Boolean), 'index.html')
}

function extractAll(source, pattern) {
  return [...source.matchAll(pattern)].map((match) => match[1])
}

function readManifest(artifactDir, findings) {
  const manifestPath = join(artifactDir, manifestName)
  if (!existsSync(manifestPath)) {
    findings.push(`out/${manifestName} is required`)
    return undefined
  }

  try {
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
    if (manifest.schema !== 'ams-route-artifact-v1') throw new Error('unsupported schema')
    if (!manifest.site?.origin || !manifest.site?.locale || !manifest.site?.siteName) throw new Error('site settings are incomplete')
    if (!Array.isArray(manifest.routes) || manifest.routes.length === 0) throw new Error('routes must be a non-empty array')
    return manifest
  } catch (error) {
    findings.push(`out/${manifestName} is invalid: ${error instanceof Error ? error.message : String(error)}`)
    return undefined
  }
}

export function verifyStaticArtifact(artifactDir = join(process.cwd(), 'out')) {
  const findings = []
  if (!existsSync(artifactDir)) return ['out/ directory does not exist. Run next build first.']

  const manifest = readManifest(artifactDir, findings)
  const files = walk(artifactDir)
  const textFiles = files.filter((file) => scannedExtensions.has(extname(file).toLowerCase()))

  for (const file of textFiles) {
    const extension = extname(file).toLowerCase()
    if (compressedExtensions.has(extension)) {
      const compressed = `${file}.gz`
      if (!existsSync(compressed)) findings.push(`precompressed artifact is missing: ${relative(artifactDir, compressed)}`)
      else {
        try {
          if (!gunzipSync(readFileSync(compressed)).equals(readFileSync(file))) findings.push(`precompressed artifact does not round-trip: ${relative(artifactDir, compressed)}`)
        } catch {
          findings.push(`precompressed artifact is invalid gzip: ${relative(artifactDir, compressed)}`)
        }
      }
    }

    const content = readFileSync(file, 'utf8')
    for (const pattern of forbiddenPatterns) if (pattern.test(content)) findings.push(`${relative(artifactDir, file)}: ${pattern}`)
  }

  for (const htmlFile of files.filter((file) => extname(file).toLowerCase() === '.html')) {
    const count = (readFileSync(htmlFile, 'utf8').match(/<h1\b/gi) ?? []).length
    if (count !== 1) findings.push(`${relative(artifactDir, htmlFile)} must contain exactly one <h1>; found ${count}`)
  }

  if (!manifest) return findings

  const expectedPaths = new Set()
  const expectedCanonicalUrls = new Set()
  for (const route of manifest.routes) {
    if (!route.path || !route.canonicalUrl || !route.locale || !['index', 'noindex'].includes(route.indexPolicy) || route.h1?.count !== 1) {
      findings.push(`manifest route is invalid: ${JSON.stringify(route)}`)
      continue
    }
    const derivedCanonicalUrl = new URL(route.path, manifest.site.origin).toString()
    if (route.canonicalUrl !== derivedCanonicalUrl) {
      findings.push(`manifest canonical mismatch for ${route.path}: expected ${derivedCanonicalUrl}, received ${route.canonicalUrl}`)
      continue
    }
    if (expectedPaths.has(route.path)) findings.push(`manifest contains duplicate route ${route.path}`)
    expectedPaths.add(route.path)
    expectedCanonicalUrls.add(route.canonicalUrl)

    const filePath = artifactFileForRoute(artifactDir, route.path)
    if (!existsSync(filePath)) {
      findings.push(`${relative(artifactDir, filePath)} is required for canonical route ${route.path}`)
      continue
    }
    const html = readFileSync(filePath, 'utf8')
    const expectedRobots = route.indexPolicy === 'index' ? 'index, follow' : 'noindex, follow'
    for (const fragment of [
      `<link rel="canonical" href="${route.canonicalUrl}"/>`,
      `<meta name="robots" content="${expectedRobots}"/>`,
      `<meta property="og:url" content="${route.canonicalUrl}"/>`,
      `<meta property="og:site_name" content="${manifest.site.siteName}"/>`,
    ]) if (!html.includes(fragment)) findings.push(`${relative(artifactDir, filePath)} is missing ${fragment}`)
    if (!html.includes(`<html lang="${route.locale.split('-')[0]}"`)) findings.push(`${relative(artifactDir, filePath)} has unexpected locale; expected ${route.locale}`)
  }

  const actualCanonicalUrls = new Set()
  for (const htmlFile of files.filter((file) => extname(file).toLowerCase() === '.html')) {
    const html = readFileSync(htmlFile, 'utf8')
    for (const canonical of extractAll(html, /<link rel="canonical" href="([^"]+)"\/>/g)) {
      actualCanonicalUrls.add(canonical)
      if (!expectedCanonicalUrls.has(canonical)) findings.push(`extra canonical route in ${relative(artifactDir, htmlFile)}: ${canonical}`)
    }
  }
  for (const canonical of expectedCanonicalUrls) if (!actualCanonicalUrls.has(canonical)) findings.push(`missing canonical route in HTML artifact: ${canonical}`)

  const sitemapPath = join(artifactDir, 'sitemap.xml')
  if (!existsSync(sitemapPath)) findings.push('out/sitemap.xml is required for static SEO artifact proof')
  else {
    const sitemapUrls = new Set(extractAll(readFileSync(sitemapPath, 'utf8'), /<loc>([^<]+)<\/loc>/g))
    const expectedSitemapUrls = new Set(manifest.routes.filter((route) => route.indexPolicy === 'index').map((route) => route.canonicalUrl))
    for (const url of expectedSitemapUrls) if (!sitemapUrls.has(url)) findings.push(`out/sitemap.xml is missing ${url}`)
    for (const url of sitemapUrls) if (!expectedSitemapUrls.has(url)) findings.push(`out/sitemap.xml contains extra URL ${url}`)
  }

  const robotsPath = join(artifactDir, 'robots.txt')
  if (!existsSync(robotsPath)) findings.push('out/robots.txt is required for static SEO artifact proof')
  else {
    const robots = readFileSync(robotsPath, 'utf8')
    for (const line of ['User-Agent: *', 'Allow: /', `Sitemap: ${new URL('/sitemap.xml', manifest.site.origin)}`]) {
      if (!robots.includes(line)) findings.push(`out/robots.txt is missing "${line}"`)
    }
    if (/^Host:/im.test(robots)) findings.push('out/robots.txt must not contain the non-standard Host directive')
  }

  return findings.map((finding) => finding.split(sep).join('/'))
}
