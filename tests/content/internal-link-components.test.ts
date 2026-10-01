import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

const uiRoot = path.join(process.cwd(), 'src/ui')

async function collectTsxFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = await Promise.all(
    entries.map((entry) => {
      const entryPath = path.join(directory, entry.name)
      return entry.isDirectory() ? collectTsxFiles(entryPath) : Promise.resolve(entryPath.endsWith('.tsx') ? [entryPath] : [])
    }),
  )

  return files.flat()
}

describe('internal link component contract', () => {
  it('keeps raw anchors limited to the safe external RichText branch', async () => {
    const rawAnchorFiles: string[] = []

    for (const file of await collectTsxFiles(uiRoot)) {
      const source = await readFile(file, 'utf8')
      if (/<a\b/.test(source)) rawAnchorFiles.push(path.relative(process.cwd(), file).replaceAll('\\', '/'))
    }

    expect(rawAnchorFiles).toEqual(['src/ui/content/rich-text.tsx'])

    const richTextSource = await readFile(path.join(uiRoot, 'content/rich-text.tsx'), 'utf8')
    expect(richTextSource).toContain("href.startsWith('/')")
    expect(richTextSource).toContain('<Link className={className} href={href}')
    expect(richTextSource).toContain('rel="noopener noreferrer"')
  })

  it('uses Next Link at every named internal navigation surface', async () => {
    const surfaces = [
      'shell/site-header.tsx',
      'shell/mobile-menu.tsx',
      'shell/site-footer.tsx',
      'shell/breadcrumbs.tsx',
      'blocks/hero-block.tsx',
      'blocks/product-routes-block.tsx',
      'pages/shared/product-section.tsx',
      'forms/lead-form.tsx',
    ]

    for (const surface of surfaces) {
      const source = await readFile(path.join(uiRoot, surface), 'utf8')
      expect(source, surface).toContain("from 'next/link'")
      expect(source, surface).not.toMatch(/<a\b/)
    }
  })
})
