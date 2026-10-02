import type { ContentRepository } from '@/core/content/repository'
import type { ArticleDTO, SiteSettingsDTO } from '@/core/content/schemas'
import { requireSiteSettings } from '@/core/content/validation/site-settings'

type JsonLdScalar = string | number | boolean | null
type JsonLdValue = JsonLdScalar | JsonLdObject | JsonLdValue[]

export type JsonLdObject = {
  [key: string]: JsonLdValue | undefined
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

export function buildOrganizationStructuredData(settingsInput: SiteSettingsDTO): JsonLdObject[] {
  const settings = requireSiteSettings(settingsInput)
  const organization = settings.organization

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: organization.name,
      legalName: organization.legalName,
      url: new URL('/', settings.domain).toString(),
      logo: new URL(organization.logo, settings.domain).toString(),
      taxID: organization.taxID,
      telephone: organization.telephone,
      email: organization.email,
    },
  ]
}

export function buildArticleStructuredData(
  article: ArticleDTO,
  settingsInput: SiteSettingsDTO,
): JsonLdObject[] {
  const settings = requireSiteSettings(settingsInput)

  if (article.status !== 'published' || article.seo.robots !== 'index' || !article.publishedAt) {
    return []
  }

  const canonicalUrl = new URL(article.path, settings.domain).toString()

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

export async function buildStructuredDataForPath(repository: ContentRepository, path: string) {
  const [article, settings] = await Promise.all([
    repository.getArticleByPath(path),
    repository.getSiteSettings(),
  ])

  if (article) {
    return buildArticleStructuredData(article, settings)
  }

  if (path === '/') {
    return buildOrganizationStructuredData(settings)
  }

  return []
}
