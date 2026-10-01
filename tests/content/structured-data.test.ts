import { describe, expect, it } from 'vitest'

import { createContentRepository } from '@/core/content/repository'
import {
  buildArticleStructuredData,
  buildFaqStructuredData,
  buildOrganizationStructuredData,
  buildStructuredDataForPath,
  serializeJsonLd,
} from '@/core/seo'
import { localContent } from '@/project/content/local-content'

describe('structured data eligibility and serialization', () => {
  it('omits product, pricing, review and draft article schema by default', async () => {
    const repository = createContentRepository(localContent)

    await expect(buildStructuredDataForPath(repository, '/impuls/')).resolves.toEqual([])
    await expect(buildStructuredDataForPath(repository, '/stati/impuls-dlya-kogo-podhodit/')).resolves.toEqual([])
  })

  it('allows only substantive published indexable articles with a publication date', async () => {
    const repository = createContentRepository({
      ...localContent,
      articles: [
        {
          ...localContent.articles[0],
          status: 'published' as const,
          publishedAt: '2026-09-30',
          seo: {
            ...localContent.articles[0].seo,
            robots: 'index' as const,
          },
        },
      ],
    })
    const article = (await repository.getArticles())[0]
    const settings = await repository.getSiteSettings()

    expect(buildArticleStructuredData(article, settings)).toEqual([
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        description: article.seo.description,
        datePublished: '2026-09-30',
        dateModified: article.updatedAt,
        mainEntityOfPage: 'https://ams24.ru/stati/kogda-podhodit-lidogeneratsiya-cherez-auditorii-operatorov/',
        url: 'https://ams24.ru/stati/kogda-podhodit-lidogeneratsiya-cherez-auditorii-operatorov/',
      },
    ])

    expect(buildArticleStructuredData({ ...article, publishedAt: undefined }, settings)).toEqual([])
    expect(buildArticleStructuredData({ ...article, seo: { ...article.seo, robots: 'noindex' } }, settings)).toEqual([])
    expect(
      buildArticleStructuredData(article, { ...settings, domain: 'https://example.test' })[0]?.url,
    ).toBe('https://example.test/stati/kogda-podhodit-lidogeneratsiya-cherez-auditorii-operatorov/')
  })

  it('uses canonical Site Settings for organization defaults', async () => {
    const settings = await createContentRepository(localContent).getSiteSettings()

    expect(
      buildOrganizationStructuredData(settings, {
        name: 'AMS24',
        url: 'https://ams24.ru/',
        sameAs: ['https://example.com/ams24'],
      }),
    ).toEqual([
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'AMS24',
        url: 'https://ams24.ru/',
        sameAs: ['https://example.com/ams24'],
      },
    ])

    expect(buildOrganizationStructuredData(settings)).toEqual([
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: settings.siteName,
        url: settings.domain,
      },
    ])
  })

  it('serializes only visible FAQ answers', () => {
    expect(
      buildFaqStructuredData({
        questions: [
          {
            question: 'Что можно публиковать?',
            answer: 'Только видимый и утверждённый ответ.',
            visible: true,
          },
          {
            question: 'Скрытый вопрос',
            answer: 'Скрытый ответ не попадает в schema.org.',
            visible: false,
          },
        ],
      }),
    ).toEqual([
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Что можно публиковать?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Только видимый и утверждённый ответ.',
            },
          },
        ],
      },
    ])
  })

  it('escapes JSON-LD for script embedding', () => {
    const json = serializeJsonLd({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: '</script><img src=x onerror=alert(1)> & line\u2028separator',
      optional: undefined,
    })

    expect(json).not.toContain('</script>')
    expect(json).not.toContain('<img')
    expect(json).not.toContain('&')
    expect(json).not.toContain('\u2028')
    expect(json).toContain('\\u003c/script\\u003e')
    expect(json).toContain('\\u0026')
    expect(json).not.toContain('optional')
  })
})
