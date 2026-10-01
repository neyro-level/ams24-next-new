import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { generateStaticParams as generateKnowledgeParams } from '@/app/baza-znaniy/[product]/[slug]/page'
import { generateStaticParams as generateArticleParams } from '@/app/stati/[slug]/page'
import { localContent } from '@/project/content/local-content'
import {
  buildArticleEditorialMetadata,
  buildKnowledgeEditorialMetadata,
  getRepresentativeKnowledgeContract,
} from '@/core/content/services/editorial-contracts'
import { createContentRepository } from '@/core/content/repository'
import { ArticleEditorialTemplate } from '@/ui/content/article-editorial-template'
import { KnowledgeEditorialTemplate } from '@/ui/content/knowledge-editorial-template'

const representativeKnowledgeContract = getRepresentativeKnowledgeContract()
const repository = createContentRepository(localContent)

describe('article and knowledge editorial contracts', () => {
  it('keeps the public article DTO and KB contract roles distinct', async () => {
    const article = await repository.getArticleByPath('/stati/kak-vybrat-produkt/')

    expect(article).toMatchObject({
      slug: 'kak-vybrat-produkt',
      status: 'published',
      seo: { robots: 'noindex' },
    })
    expect(representativeKnowledgeContract.kind).toBe('knowledge')
    expect(representativeKnowledgeContract.task).toContain('подготовить')
    expect(article).not.toHaveProperty('targetCommercialPage')
    expect(article).not.toHaveProperty('sourceLedger')
    expect(representativeKnowledgeContract).toHaveProperty('prerequisites')
    expect(representativeKnowledgeContract).not.toHaveProperty('primaryQuery')
  })

  it('builds noindex metadata until content is approved', async () => {
    const article = await repository.getArticleByPath('/stati/kak-vybrat-produkt/')
    if (!article) throw new Error('Expected repository-backed article')

    expect((await buildArticleEditorialMetadata(article)).robots).toMatchObject({
      index: false,
      follow: true,
    })
    expect((await buildKnowledgeEditorialMetadata(representativeKnowledgeContract)).robots).toMatchObject({
      index: false,
      follow: true,
    })
  })

  it('keeps editorial drafts noindex while exporting only representative noindex routes', async () => {
    const draftArticles = localContent.articles.filter((article) => article.status === 'draft')
    expect(draftArticles).toHaveLength(3)
    expect(draftArticles.every((article) => article.seo.robots === 'noindex')).toBe(true)
    expect(localContent.knowledgeArticles.every((article) => article.status === 'draft' && article.seo.robots === 'noindex')).toBe(true)
    expect(await generateArticleParams()).toEqual([{ slug: 'kak-vybrat-produkt' }])
    expect(generateKnowledgeParams()).toEqual([{
      product: representativeKnowledgeContract.product,
      slug: representativeKnowledgeContract.slug,
    }])
  })

  it('renders editorial typography and different layouts', async () => {
    const article = await repository.getArticleByPath('/stati/kak-vybrat-produkt/')
    if (!article) throw new Error('Expected repository-backed article')
    const articleHtml = renderToStaticMarkup(
      <ArticleEditorialTemplate article={article} />,
    )
    const kbHtml = renderToStaticMarkup(
      <KnowledgeEditorialTemplate contract={representativeKnowledgeContract} />,
    )

    expect(articleHtml).toContain('Статья')
    expect(articleHtml).not.toContain('Target commercial page')
    expect(articleHtml).toContain('data-rich-text')
    expect(articleHtml).toContain('Короткий ответ')
    expect(articleHtml).toContain('text-h1')
    expect(articleHtml).toContain('max-w-narrow')
    expect(kbHtml).toContain('База знаний · support task')
    expect(kbHtml).toContain('Перед началом')
    expect(kbHtml).toContain('data-rich-text')
    expect(kbHtml).toContain('Шаг 2')
    expect(kbHtml).toContain('Шаг 1')
    expect(kbHtml).toContain('max-w-narrow')
  })
})
