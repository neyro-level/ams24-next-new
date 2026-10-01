import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { productIdSchema, productSchema, type ProductId } from '@/core/content/schemas'
import { analyticsProductSchema } from '@/core/analytics'
import { initialEditorialBriefs } from '@/project/editorial-briefs'
import { leadContextSchema } from '@/core/leads'

const productIds: ProductId[] = ['impuls', 'pixel', 'zashchita']

describe('canonical ProductId contract', () => {
  it('derives product entity identity from one exported schema', () => {
    expect(productIdSchema.options).toEqual(productIds)
    expect(productSchema.shape.id).toBe(productIdSchema)
  })

  it('reuses ProductId in lead, analytics and editorial contracts', () => {
    for (const product of productIds) {
      expect(leadContextSchema.safeParse({ product, route: `/${product}/`, ctaId: 'test' }).success).toBe(true)
      expect(analyticsProductSchema.safeParse(product).success).toBe(true)
    }

    expect(leadContextSchema.safeParse({ product: 'site', route: '/', ctaId: 'test' }).success).toBe(true)
    expect(analyticsProductSchema.safeParse('site').success).toBe(true)
    expect(initialEditorialBriefs.every((brief) => productIdSchema.safeParse(brief.targetProduct).success)).toBe(true)
  })

  it('contains no copied literal ProductId union or legacy productRefSchema', () => {
    const files = [
      'src/core/content/schemas/common.ts',
      'src/core/content/schemas/entities.ts',
      'src/core/analytics/index.ts',
      'src/core/leads/index.ts',
      'src/project/editorial-briefs.ts',
      'src/project/product-claims.ts',
      'src/project/proof-inventory.ts',
    ]
    const sources = files.map((file) => readFileSync(join(process.cwd(), file), 'utf8'))
    const copiedUnion = /['"]impuls['"]\s*\|\s*['"]pixel['"]\s*\|\s*['"]zashchita['"]/

    expect(sources.filter((source) => /export const productIdSchema\s*=/.test(source))).toHaveLength(1)
    expect(sources.some((source) => copiedUnion.test(source))).toBe(false)
    expect(sources.some((source) => source.includes('productRefSchema'))).toBe(false)
  })
})
