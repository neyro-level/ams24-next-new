import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const matrixPath = join(process.cwd(), 'docs/research/ROUTE_COMPONENT_OWNERSHIP_MATRIX_CR_10_1.md')

const requiredRoutes = [
  '/',
  '/impuls/',
  '/pixel/',
  '/zashchita/',
  '/tarify/',
  '/raschety/',
  '/keisy/',
  '/keisy/[slug]/',
  '/otzyvy/',
  '/stati/',
  '/stati/[slug]/',
  '/baza-znaniy/',
  '/baza-znaniy/[product]/[slug]/',
  '/o-kompanii/',
  '/kontakty/',
  '/politika/',
  '/soglasie/',
  '/obrabotka-dannyh/',
  '/rekvizity/',
  '/404',
] as const

const requiredBoundaryFiles = [
  'src/ui/forms/lead-form.tsx',
  'src/ui/legal/legal-page.tsx',
  'src/ui/shell/route-skeleton-page.tsx',
  'src/ui/shell/detail-fixture-page.tsx',
  'src/ui/content/article-editorial-template.tsx',
  'src/ui/content/knowledge-editorial-template.tsx',
] as const

describe('CR-10.1 route-to-component ownership matrix', () => {
  it('covers every public route and key shared boundary', () => {
    const matrix = readFileSync(matrixPath, 'utf8')

    for (const route of requiredRoutes) {
      expect(matrix, route).toContain(`| \`${route}\``)
    }

    for (const file of requiredBoundaryFiles) {
      expect(matrix, file).toContain(file)
    }
  })

  it('keeps decomposition stop rules explicit', () => {
    const matrix = readFileSync(matrixPath, 'utf8')

    expect(matrix).toContain('do not create a semantic CTA row yet')
    expect(matrix).toContain('no generic product builder')
    expect(matrix).toContain('do not change form behavior')
    expect(matrix).toContain('no CR-10 decomposition before real case content')
  })
})
