import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import {
  buildArticleEditorialMetadata,
  buildKnowledgeEditorialMetadata,
  representativeArticleContract,
  representativeKnowledgeContract,
} from '@/project/editorial-contracts'
import { ArticleEditorialTemplate } from '@/ui/content/article-editorial-template'
import { KnowledgeEditorialTemplate } from '@/ui/content/knowledge-editorial-template'

describe('article and knowledge editorial contracts', () => {
  it('keeps article and KB roles distinct', () => {
    expect(representativeArticleContract.kind).toBe('article')
    expect(representativeKnowledgeContract.kind).toBe('knowledge')
    expect(representativeArticleContract.primaryIntent).toContain('editorial')
    expect(representativeKnowledgeContract.task).toContain('подготовить')
    expect(representativeArticleContract).toHaveProperty('targetCommercialPage')
    expect(representativeKnowledgeContract).toHaveProperty('prerequisites')
    expect(representativeArticleContract).not.toHaveProperty('steps')
    expect(representativeKnowledgeContract).not.toHaveProperty('primaryQuery')
  })

  it('keeps unchecked SEO/source facts explicit instead of invented', () => {
    expect(representativeArticleContract.primaryQuery).toBe('not checked')
    expect(representativeArticleContract.sourceLedger[0]?.checkedAt).toBe('not checked')
    expect(representativeArticleContract.sourceLedger[0]?.status).toBe('not checked')
  })

  it('builds noindex metadata until content is approved', () => {
    expect(buildArticleEditorialMetadata(representativeArticleContract).robots).toMatchObject({
      index: false,
      follow: true,
    })
    expect(buildKnowledgeEditorialMetadata(representativeKnowledgeContract).robots).toMatchObject({
      index: false,
      follow: true,
    })
  })

  it('renders editorial typography and different layouts', () => {
    const articleHtml = renderToStaticMarkup(
      <ArticleEditorialTemplate contract={representativeArticleContract} />,
    )
    const kbHtml = renderToStaticMarkup(
      <KnowledgeEditorialTemplate contract={representativeKnowledgeContract} />,
    )

    expect(articleHtml).toContain('Статья · editorial intent')
    expect(articleHtml).toContain('Target commercial page')
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
