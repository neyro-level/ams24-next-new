import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

import { describe, expect, it } from 'vitest'

function collectTypeScriptFiles(root: string): string[] {
  const files: string[] = []

  for (const entry of readdirSync(root)) {
    const path = join(root, entry)
    const stat = statSync(path)

    if (stat.isDirectory()) {
      files.push(...collectTypeScriptFiles(path))
    } else if (/\.(ts|tsx)$/.test(entry)) {
      files.push(path)
    }
  }

  return files
}

describe('T2.6 contract ownership', () => {
  it('keeps lead and analytics contracts under their core owners', () => {
    expect(existsSync('src/core/leads/index.ts')).toBe(true)
    expect(existsSync('src/core/analytics/index.ts')).toBe(true)
    expect(existsSync('src/project/lead-contract.ts')).toBe(false)
    expect(existsSync('src/project/analytics.ts')).toBe(false)
    expect(existsSync('src/core/content/services/lead-contract.ts')).toBe(false)
  })

  it('does not keep re-export shims in content services', () => {
    for (const file of collectTypeScriptFiles('src/core/content/services')) {
      expect(readFileSync(file, 'utf8'), relative(process.cwd(), file)).not.toMatch(/^export\s*\{/m)
    }
  })

  it('exposes skeleton and legal project data only through content services', () => {
    const protectedSources = [
      '@/project/content/legal-pages',
      '@/project/content/route-skeletons',
    ]

    for (const file of collectTypeScriptFiles('src')) {
      const source = readFileSync(file, 'utf8')

      for (const protectedSource of protectedSources) {
        if (!source.includes(protectedSource)) continue
        expect(relative(process.cwd(), file), protectedSource).toMatch(/^src[\\/]core[\\/]content[\\/]services[\\/]/)
      }
    }
  })

  it('keeps legal content lookup and metadata outside the UI template', () => {
    const source = readFileSync('src/ui/legal/legal-page.tsx', 'utf8')

    expect(source).toContain('page: LegalPageDTO')
    expect(source).not.toMatch(/getLegalPage|buildLegalMetadata|legalDraftVersion|@\/project\//)
  })
})
