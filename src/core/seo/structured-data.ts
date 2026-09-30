import type { ContentRepository } from '@/core/content/repository'
import type { ArticleDTO } from '@/core/content/schemas'

type JsonLdScalar = string | number | boolean | null
type JsonLdValue = JsonLdScalar | JsonLdObject | JsonLdValue[]

export type JsonLdObject = {
  [key: string]: JsonLdValue | undefined
}

export type OrganizationStructuredDataFacts = {
  name: string
  url: string
  contactPoint?: {
    contactType: string
    telephone?: string
    email?: string
  }
  sameAs?: string[]
}

export type FaqStructuredDataFacts = {
  questions: Array<{
    question: string
    answer: string
    visible: boolean
  }>
}

function compactJsonLd(value: JsonLdValue): JsonLdValue | undefined {
  if (Array.isArray(value)) {
    const compacted = value.map(compactJsonLd).filter((item): item is JsonLdValue => item !== undefined)
    return compacted.length > 0 ? compacted : undefined
  }

  if (value && typeof value === 'object') {
    const entries = Object.entries(value)
      .map(([key, item]) => [key, item === undefined ? undefined : compactJsonLd(item)] as const)
      .filter((entry): entry is readonly [string, JsonLdValue] => entry[1] !== undefined)

    return entries.length > 0 ? Object.fromEntries(entries) : undefined
  }

  return value
}

export function serializeJsonLd(value: JsonLdObject | JsonLdObject[]) {
  const compacted = compactJsonLd(value)

  return JSON.stringify(compacted)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

export function buildOrganizationStructuredData(facts?: OrganizationStructuredDataFacts): JsonLdObject[] {
  if (!facts) {
    return []
  }

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: facts.name,
      url: facts.url,
      contactPoint: facts.contactPoint
        ? {
            '@type': 'ContactPoint',
            contactType: facts.contactPoint.contactType,
            telephone: facts.contactPoint.telephone,
            email: facts.contactPoint.email,
          }
        : undefined,
      sameAs: facts.sameAs,
    },
  ]
}

export function buildArticleStructuredData(article: ArticleDTO, siteUrl = 'https://ams24.ru'): JsonLdObject[] {
  if (article.status !== 'published' || article.seo.robots !== 'index' || !article.publishedAt) {
    return []
  }

  const canonicalUrl = new URL(article.path, siteUrl).toString()

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.seo.description,
      datePublished: article.publishedAt,
      dateModified: article.updatedAt ?? article.publishedAt,
      mainEntityOfPage: canonicalUrl,
      url: canonicalUrl,
    },
  ]
}

export function buildFaqStructuredData(facts: FaqStructuredDataFacts): JsonLdObject[] {
  const visibleQuestions = facts.questions.filter((item) => item.visible)

  if (visibleQuestions.length === 0) {
    return []
  }

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: visibleQuestions.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    },
  ]
}

export function buildStructuredDataForPath(repository: ContentRepository, path: string) {
  const article = repository.getArticleByPath(path)

  if (article) {
    return buildArticleStructuredData(article, repository.siteSettings?.domain)
  }

  return []
}
