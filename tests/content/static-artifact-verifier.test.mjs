import { mkdir, mkdtemp, readFile, rm, unlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { gzipSync } from 'node:zlib'

import { afterEach, describe, expect, it } from 'vitest'

import { verifyStaticArtifact } from '../../scripts/lib/static-artifact-verifier.mjs'

const fixtures = []

async function writeCompressed(file, content) {
  await mkdir(path.dirname(file), { recursive: true })
  await writeFile(file, content)
  await writeFile(`${file}.gz`, gzipSync(content, { level: 9, mtime: 0 }))
}

function html(canonical, robots = 'index, follow', h1 = '<h1>Title</h1>') {
  return `<html lang="ru"><head><link rel="canonical" href="${canonical}"/><meta name="robots" content="${robots}"/><meta property="og:url" content="${canonical}"/><meta property="og:site_name" content="Example"/></head><body>${h1}</body></html>`
}

async function createFixture() {
  const root = await mkdtemp(path.join(tmpdir(), 'ams24-artifact-'))
  fixtures.push(root)
  const manifest = {
    schema: 'ams-route-artifact-v1',
    site: { origin: 'https://example.test', locale: 'ru-RU', siteName: 'Example' },
    routes: [
      { path: '/', canonicalUrl: 'https://example.test/', locale: 'ru-RU', indexPolicy: 'index', h1: { count: 1 } },
      { path: '/hidden/', canonicalUrl: 'https://example.test/hidden/', locale: 'ru-RU', indexPolicy: 'noindex', h1: { count: 1 } },
    ],
  }
  await writeFile(path.join(root, 'ams-routes.json'), JSON.stringify(manifest))
  await writeCompressed(path.join(root, 'index.html'), html('https://example.test/'))
  await writeCompressed(path.join(root, 'hidden', 'index.html'), html('https://example.test/hidden/', 'noindex, follow'))
  await writeCompressed(path.join(root, 'sitemap.xml'), '<urlset><url><loc>https://example.test/</loc></url></urlset>')
  await writeCompressed(path.join(root, 'robots.txt'), 'User-Agent: *\nAllow: /\nSitemap: https://example.test/sitemap.xml\n')
  return root
}

afterEach(async () => {
  await Promise.all(fixtures.splice(0).map((fixture) => rm(fixture, { recursive: true, force: true })))
})

describe('static artifact verifier', () => {
  it('accepts a complete manifest-bound artifact', async () => {
    expect(verifyStaticArtifact(await createFixture())).toEqual([])
  })

  it('rejects the non-standard robots Host directive', async () => {
    const root = await createFixture()
    await writeCompressed(
      path.join(root, 'robots.txt'),
      'User-Agent: *\nAllow: /\nSitemap: https://example.test/sitemap.xml\nHost: https://example.test\n',
    )

    expect(verifyStaticArtifact(root)).toContain('out/robots.txt must not contain the non-standard Host directive')
  })

  it('fails for a missing canonical route', async () => {
    const root = await createFixture()
    await unlink(path.join(root, 'hidden', 'index.html'))
    await unlink(path.join(root, 'hidden', 'index.html.gz'))

    expect(verifyStaticArtifact(root).join('\n')).toContain('is required for canonical route /hidden/')
  })

  it('fails for an extra canonical route', async () => {
    const root = await createFixture()
    await writeCompressed(path.join(root, 'extra', 'index.html'), html('https://example.test/extra/'))

    expect(verifyStaticArtifact(root).join('\n')).toContain('extra canonical route')
  })

  it('fails for canonical mismatch', async () => {
    const root = await createFixture()
    await writeCompressed(path.join(root, 'hidden', 'index.html'), html('https://example.test/wrong/', 'noindex, follow'))

    expect(verifyStaticArtifact(root).join('\n')).toContain('https://example.test/hidden/')
  })

  it('fails when the manifest canonical does not match Site Settings and path', async () => {
    const root = await createFixture()
    const manifestPath = path.join(root, 'ams-routes.json')
    const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
    manifest.routes[1].canonicalUrl = 'https://wrong.example/hidden/'
    await writeFile(manifestPath, JSON.stringify(manifest))

    expect(verifyStaticArtifact(root).join('\n')).toContain('manifest canonical mismatch for /hidden/')
  })

  it('fails when any HTML page has other than exactly one h1', async () => {
    const root = await createFixture()
    const file = path.join(root, 'index.html')
    const source = await readFile(file, 'utf8')
    await writeCompressed(file, source.replace('</body>', '<h1>Duplicate</h1></body>'))

    expect(verifyStaticArtifact(root).join('\n')).toContain('must contain exactly one <h1>; found 2')
  })

  it('fails when any HTML page has no h1', async () => {
    const root = await createFixture()
    const file = path.join(root, 'hidden', 'index.html')
    const source = await readFile(file, 'utf8')
    await writeCompressed(file, source.replace('<h1>Title</h1>', ''))

    expect(verifyStaticArtifact(root).join('\n')).toContain('must contain exactly one <h1>; found 0')
  })
})
