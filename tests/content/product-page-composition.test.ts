import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

const productRoutes = ['impuls', 'pixel', 'zashchita'] as const

describe('product page composition boundary', () => {
  it('keeps route files focused on data loading, metadata and section composition', async () => {
    for (const route of productRoutes) {
      const source = await readFile(
        path.join(process.cwd(), 'src', 'app', route, 'page.tsx'),
        'utf8',
      )

      expect(source.split(/\r?\n/).length, route).toBeLessThan(50)
      expect(source, route).toContain('@/core/content/services/product-pages')
      expect(source, route).toContain(`@/ui/pages/${route}/details-section`)
      expect(source, route).not.toMatch(/function\s+\w+Section/)
      expect(source, route).not.toMatch(
        /const\s+(criteria|requirements|boundaries|symptoms|steps|faqs)/,
      )
    }
  })

  it('keeps project content behind the core service seam', async () => {
    const service = await readFile(
      path.join(process.cwd(), 'src/core/content/services/product-pages.ts'),
      'utf8',
    )
    expect(service).toContain('@/project/content/product-pages')

    for (const route of productRoutes) {
      const ui = await readFile(
        path.join(
          process.cwd(),
          'src',
          'ui',
          'pages',
          route,
          'details-section.tsx',
        ),
        'utf8',
      )
      expect(ui, route).not.toContain('@/project/content')
    }
  })

  it('owns the genuinely shared product sections in one module', async () => {
    const source = await readFile(
      path.join(process.cwd(), 'src/ui/pages/shared/product-section.tsx'),
      'utf8',
    )

    for (const component of [
      'ProductHeroSection',
      'ProductStepsSection',
      'ProductFaqSection',
      'ProductLeadSection',
    ]) {
      expect(source).toContain(`export function ${component}`)
    }
  })
})
