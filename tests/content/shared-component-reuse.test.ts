import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

const inventoryPath = join(process.cwd(), 'docs/research/SHARED_COMPONENT_REUSE_INVENTORY_CR_10_3.md')

const forbiddenSharedBuilders = [
  'src/ui/shared/product-page.tsx',
  'src/ui/shared/product-page-builder.tsx',
  'src/ui/shared/page-builder.tsx',
  'src/ui/shared/route-builder.tsx',
  'src/ui/shared/section-registry.tsx',
  'src/ui/content/block-registry.tsx',
  'src/ui/shared/cta-row.tsx',
] as const

const primaryRouteFiles = [
  'src/app/page.tsx',
  'src/app/impuls/page.tsx',
  'src/app/pixel/page.tsx',
  'src/app/zashchita/page.tsx',
] as const

const forbiddenBuilderImports = [
  '@/ui/shared/product-page',
  '@/ui/shared/product-page-builder',
  '@/ui/shared/page-builder',
  '@/ui/shared/route-builder',
  '@/ui/shared/section-registry',
  '@/ui/content/block-registry',
] as const

describe('CR-10.3 shared component reuse guard', () => {
  const inventory = readFileSync(inventoryPath, 'utf8')

  it('documents the explicit no-universal-builder decision', () => {
    expect(inventory).toContain('No new generic page builder')
    expect(inventory).toContain('ProductPageBuilder')
    expect(inventory).toContain('SectionRegistry')
    expect(inventory).toContain('ProductHero')
  })

  it('does not add forbidden shared builder files', () => {
    for (const file of forbiddenSharedBuilders) {
      expect(existsSync(join(process.cwd(), file))).toBe(false)
    }
  })

  it('keeps primary routes free from generic builder imports', () => {
    for (const file of primaryRouteFiles) {
      const source = readFileSync(join(process.cwd(), file), 'utf8')

      for (const importPath of forbiddenBuilderImports) {
        expect(source).not.toContain(importPath)
      }
    }
  })

  it('keeps route-specific sections local instead of exported as shared contracts', () => {
    for (const file of primaryRouteFiles) {
      const source = readFileSync(join(process.cwd(), file), 'utf8')

      expect(source).not.toMatch(/export function .*Section/)
      expect(source).not.toMatch(/export const .*Section/)
    }
  })
})
