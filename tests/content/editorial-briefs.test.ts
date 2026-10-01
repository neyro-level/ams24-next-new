import { describe, expect, it } from 'vitest'

import { createContentRepository } from '@/core/content/repository'
import { localContent } from '@/project/content/local-content'
import { initialArticleBriefs, initialEditorialBriefs, initialKnowledgeBriefs } from '@/project/editorial-briefs'

const productPaths = {
  impuls: '/impuls/',
  pixel: '/pixel/',
  zashchita: '/zashchita/',
} as const

describe('initial article and knowledge briefs', () => {
  it('satisfies the approved release minimum with one article and one KB brief per product', () => {
    expect(initialArticleBriefs).toHaveLength(3)
    expect(initialKnowledgeBriefs).toHaveLength(3)

    for (const product of Object.keys(productPaths)) {
      expect(initialArticleBriefs.some((brief) => brief.targetProduct === product)).toBe(true)
      expect(initialKnowledgeBriefs.some((brief) => brief.targetProduct === product)).toBe(true)
    }
  })

  it('keeps every brief tied to a canonical product page and CTA', () => {
    for (const brief of initialEditorialBriefs) {
      expect(brief.targetCommercialPage.path).toBe(productPaths[brief.targetProduct])
      expect(brief.cta.path).toBe(productPaths[brief.targetProduct])
      expect(brief.primaryIntent.length).toBeGreaterThan(20)
      expect(brief.jtbd.length).toBeGreaterThan(20)
      expect(brief.seoTitle.length).toBeGreaterThanOrEqual(10)
      expect(brief.seoTitle.length).toBeLessThanOrEqual(70)
    }
  })

  it('keeps intent/source evidence revalidated without turning competitor pages into AMS facts', () => {
    for (const brief of initialEditorialBriefs) {
      expect(brief.sourceLedger.length).toBeGreaterThanOrEqual(2)
      expect(brief.sourceLedger.some((source) => source.sourceType === 'project')).toBe(true)
      expect(brief.sourceLedger.every((source) => source.checkedAt === '2026-09-29')).toBe(true)
      expect(brief.sourceLedger.every((source) => source.status === 'verified' || source.status === 'partial')).toBe(
        true,
      )
      expect(brief.forbiddenClaims.length).toBeGreaterThan(0)
    }
  })

  it('turns initial article briefs into substantive reviewed draft articles without indexing them', async () => {
    const repository = createContentRepository(localContent)

    for (const brief of initialArticleBriefs) {
      const article = await repository.getArticleByPath(brief.outputPath)

      expect(article).toBeDefined()
      expect(article).toMatchObject({
        id: brief.id,
        slug: brief.slug,
        status: 'draft',
        productRefs: [brief.targetProduct],
      })
      expect(article?.seo.robots).toBe('noindex')
      expect(article?.seo.title).toBe(brief.seoTitle)
      expect(article?.seo.canonicalPath).toBe(brief.outputPath)
      expect(article?.body.format).toBe('markdown')
      if (!article || article.body.format !== 'markdown') throw new Error('Expected markdown article body')
      expect(article.body.value.length).toBeGreaterThan(1_300)
      expect(article.body.value).toContain(brief.targetCommercialPage.path)
      expect(article.body.value).not.toMatch(/гарантируем|абсолютн(?:ую|ая) защиту|каждого посетителя/i)
    }
  })

  it('turns initial KB briefs into actionable current draft instructions', async () => {
    const repository = createContentRepository(localContent)

    for (const brief of initialKnowledgeBriefs) {
      const article = await repository.getKnowledgeArticleByPath(brief.outputPath)

      expect(article).toBeDefined()
      expect(article).toMatchObject({
        id: brief.id,
        slug: brief.slug,
        status: 'draft',
        productRef: brief.targetProduct,
        task: brief.task,
        updatedAt: '2026-09-29',
      })
      expect(article?.seo.robots).toBe('noindex')
      expect(article?.seo.title).toBe(brief.seoTitle)
      expect(article?.seo.canonicalPath).toBe(brief.outputPath)
      expect(article?.body.format).toBe('markdown')
      if (!article || article.body.format !== 'markdown') throw new Error('Expected markdown knowledge body')
      expect(article.body.value).toContain('## Шаг 1')
      expect(article.body.value).toContain('Результат:')
      expect(article.body.value).toContain('## Следующий шаг')
      expect(article.body.value).toContain(brief.targetCommercialPage.path)
      expect(article.body.value).not.toMatch(/передайте пароли|гарантируем|обход/i)
    }
  })
})
