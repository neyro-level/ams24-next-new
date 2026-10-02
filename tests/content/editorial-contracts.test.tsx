import { readFileSync } from 'node:fs'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { generateStaticParams as generateKnowledgeParams } from '@/app/baza-znaniy/[product]/[slug]/page'
import { generateStaticParams as generateArticleParams } from '@/app/stati/[slug]/page'
import { localContent } from '@/project/content/local-content'
import { redirects } from '@/project/redirects'
import {
  buildArticleEditorialMetadata,
  buildKnowledgeEditorialMetadata,
  toPublicArticleDTO,
  toPublicKnowledgeArticleDTO,
} from '@/core/content/services/editorial-contracts'
import { publicArticleSchema, publicKnowledgeArticleSchema } from '@/core/content/schemas'
import { createContentRepository } from '@/core/content/repository'
import { ArticleEditorialTemplate } from '@/ui/content/article-editorial-template'
import { KnowledgeEditorialTemplate } from '@/ui/content/knowledge-editorial-template'

const repository = createContentRepository(localContent)

describe('article and knowledge editorial contracts', () => {
  it('serves public article and knowledge routes from repository DTOs', async () => {
    const article = await repository.getArticleByPath('/stati/kak-vybrat-produkt/')
    const knowledge = await repository.getKnowledgeArticleByPath('/baza-znaniy/impuls/kak-podgotovit-raschet/')

    expect(article).toMatchObject({
      slug: 'kak-vybrat-produkt',
      status: 'published',
      seo: { robots: 'noindex' },
    })
    expect(knowledge).toMatchObject({
      slug: 'kak-podgotovit-raschet',
      productRef: 'impuls',
      status: 'published',
      seo: { robots: 'noindex' },
    })
    expect(article).not.toHaveProperty('targetCommercialPage')
    expect(article).not.toHaveProperty('sourceLedger')
    expect(knowledge).not.toHaveProperty('prerequisites')
    expect(knowledge).not.toHaveProperty('sourceLedger')
  })

  it('builds noindex metadata until content is approved', async () => {
    const article = await repository.getArticleByPath('/stati/kak-vybrat-produkt/')
    const knowledge = await repository.getKnowledgeArticleByPath('/baza-znaniy/impuls/kak-podgotovit-raschet/')
    if (!article) throw new Error('Expected repository-backed article')
    if (!knowledge) throw new Error('Expected repository-backed knowledge article')

    expect((await buildArticleEditorialMetadata(article)).robots).toMatchObject({
      index: false,
      follow: true,
    })
    expect((await buildKnowledgeEditorialMetadata(knowledge)).robots).toMatchObject({
      index: false,
      follow: true,
    })
  })

  it('maps repository entities to strict public DTOs before template rendering', async () => {
    const article = await repository.getArticleByPath('/stati/kak-vybrat-produkt/')
    const knowledge = await repository.getKnowledgeArticleByPath('/baza-znaniy/impuls/kak-podgotovit-raschet/')
    if (!article) throw new Error('Expected repository-backed article')
    if (!knowledge) throw new Error('Expected repository-backed knowledge article')

    const publicArticle = toPublicArticleDTO(article)
    const publicKnowledge = toPublicKnowledgeArticleDTO(knowledge)
    const forbiddenFields = ['outline', 'sourceLedger', 'targetCommercialPage', 'readerQuestion', 'sectionJob']

    expect(Object.keys(publicArticle).sort()).toEqual(['body', 'description', 'path', 'title'])
    expect(Object.keys(publicKnowledge).sort()).toEqual(['body', 'description', 'path', 'productRef', 'title'])
    for (const field of forbiddenFields) {
      expect(publicArticle).not.toHaveProperty(field)
      expect(publicKnowledge).not.toHaveProperty(field)
    }
    expect(publicArticleSchema.safeParse({ ...publicArticle, outline: ['internal'] }).success).toBe(false)
    expect(publicKnowledgeArticleSchema.safeParse({ ...publicKnowledge, sectionJob: 'internal' }).success).toBe(false)
  })

  it('types public templates against the narrow DTO boundary', () => {
    const articleTemplate = readFileSync('src/ui/content/article-editorial-template.tsx', 'utf8')
    const knowledgeTemplate = readFileSync('src/ui/content/knowledge-editorial-template.tsx', 'utf8')

    expect(articleTemplate).toContain('PublicArticleDTO')
    expect(articleTemplate).not.toMatch(/\bArticleDTO\b/)
    expect(knowledgeTemplate).toContain('PublicKnowledgeArticleDTO')
    expect(knowledgeTemplate).not.toMatch(/\bKnowledgeArticleDTO\b/)
  })

  it('keeps editorial drafts noindex while exporting only representative noindex routes', async () => {
    const draftArticles = localContent.articles.filter((article) => article.status === 'draft')
    expect(draftArticles).toHaveLength(3)
    expect(draftArticles.every((article) => article.seo.robots === 'noindex')).toBe(true)
    const draftKnowledge = localContent.knowledgeArticles.filter((article) => article.status === 'draft')
    expect(draftKnowledge).toHaveLength(2)
    expect(draftKnowledge.every((article) => article.seo.robots === 'noindex')).toBe(true)
    expect(await generateArticleParams()).toEqual([{ slug: 'kak-vybrat-produkt' }])
    expect(await generateKnowledgeParams()).toEqual([{
      product: 'impuls',
      slug: 'kak-podgotovit-raschet',
    }])
    expect(redirects.some((rule) => rule.source.includes('kak-podgotovit-raschet-impuls'))).toBe(false)
  })

  it('renders editorial typography and different layouts', async () => {
    const article = await repository.getArticleByPath('/stati/kak-vybrat-produkt/')
    const knowledge = await repository.getKnowledgeArticleByPath('/baza-znaniy/impuls/kak-podgotovit-raschet/')
    if (!article) throw new Error('Expected repository-backed article')
    if (!knowledge) throw new Error('Expected repository-backed knowledge article')
    const articleHtml = renderToStaticMarkup(
      <ArticleEditorialTemplate article={toPublicArticleDTO(article)} />,
    )
    const kbHtml = renderToStaticMarkup(
      <KnowledgeEditorialTemplate article={toPublicKnowledgeArticleDTO(knowledge)} />,
    )

    expect(articleHtml).toContain('Статья')
    expect(articleHtml).not.toContain('Target commercial page')
    expect(articleHtml).toContain('data-rich-text')
    expect(articleHtml).toContain('Короткий ответ')
    expect(articleHtml).toContain('text-h1')
    expect(articleHtml).toContain('max-w-narrow')
    expect(kbHtml).toContain('База знаний')
    expect(kbHtml).not.toContain('Перед началом')
    expect(kbHtml).toContain('data-rich-text')
    expect(kbHtml).toContain('Шаг 2')
    expect(kbHtml).toContain('Шаг 1')
    expect(kbHtml).toContain('max-w-narrow')
  })
})
