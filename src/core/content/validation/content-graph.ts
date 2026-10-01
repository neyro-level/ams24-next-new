import type { ContentRepository } from '@/core/content/repository'
import type {
  ArticleDTO,
  CalculationExampleDTO,
  CaseDTO,
  KnowledgeArticleDTO,
  NavigationDTO,
  PageDTO,
  ProductDTO,
  ReviewDTO,
  RichTextDTO,
  TariffDTO,
} from '@/core/content/schemas'
import { normalizePath } from '@/core/lib/path'

export type ContentGraphIssueCode =
  | 'broken-link'
  | 'orphan-product'
  | 'duplicate-intent'
  | 'unsupported-topic-hub'
  | 'duplicate-global-id'
  | 'duplicate-canonical-path'
  | 'canonical-mismatch'
  | 'slug-mismatch'
  | 'broken-product-ref'
  | 'broken-navigation-ref'
  | 'broken-block-ref'
  | 'invalid-media'
  | 'invalid-redirect'
  | 'invalid-publication-state'
  | 'missing-updated-at'
  | 'seo-incomplete'
  | 'contradictory-index-policy'
  | 'unsupported-richtext-format'

export type ContentGraphIssue = {
  code: ContentGraphIssueCode
  severity: 'error'
  entity: string
  message: string
}

export type ContentGraphRedirect = {
  source: string
  destination: string
  permanent: true
}

export type ContentGraphValidationOptions = {
  redirects?: ContentGraphRedirect[]
}

type ContentRepositoryData = {
  navigation: NavigationDTO
  products: ProductDTO[]
  pages: PageDTO[]
  tariffs: TariffDTO[]
  cases: CaseDTO[]
  reviews: ReviewDTO[]
  calculations: CalculationExampleDTO[]
  articles: ArticleDTO[]
  knowledgeArticles: KnowledgeArticleDTO[]
}

async function loadContentRepository(repository: ContentRepository): Promise<ContentRepositoryData> {
  const [navigation, products, pages, tariffs, cases, reviews, calculations, articles, knowledgeArticles] =
    await Promise.all([
      repository.getNavigation(),
      repository.getProducts(),
      repository.getPages(),
      repository.getTariffs(),
      repository.getCases(),
      repository.getReviews(),
      repository.getCalculations(),
      repository.getArticles(),
      repository.getKnowledgeArticles(),
    ])

  return { navigation, products, pages, tariffs, cases, reviews, calculations, articles, knowledgeArticles }
}

const markdownLinkPattern = /\[[^\]]+\]\((\/[^)\s]+)\)/g
const approvedStaticPaths = [
  '/tarify/',
  '/raschety/',
  '/keisy/',
  '/otzyvy/',
  '/stati/',
  '/baza-znaniy/',
  '/o-kompanii/',
  '/kontakty/',
  '/rekvizity/',
  '/politika/',
  '/soglasie/',
  '/obrabotka-dannyh/',
] as const

function routeFromHref(href: string) {
  return normalizePath(href.split('#')[0] || '/')
}

function slugFromPath(path: string) {
  const segments = path.split('/').filter(Boolean)
  return segments.at(-1) ?? 'home'
}

function extractInternalLinks(markdown: string) {
  const links = new Set<string>()
  let match: RegExpExecArray | null

  while ((match = markdownLinkPattern.exec(markdown))) {
    links.add(normalizePath(match[1].split('#')[0] || '/'))
  }

  return [...links]
}

function buildKnownPaths(repository: ContentRepositoryData) {
  return new Set([
    ...repository.products.map((item) => item.path),
    ...repository.pages.map((item) => item.path),
    ...repository.cases.map((item) => item.path),
    ...repository.articles.map((item) => item.path),
    ...repository.knowledgeArticles.map((item) => item.path),
    ...approvedStaticPaths,
  ])
}

function issue(code: ContentGraphIssueCode, entity: string, message: string): ContentGraphIssue {
  return {
    code,
    severity: 'error',
    entity,
    message,
  }
}

function validateMarkdownLinks(
  issues: ContentGraphIssue[],
  entity: string,
  markdown: string,
  knownPaths: Set<string>,
) {
  for (const link of extractInternalLinks(markdown)) {
    if (!knownPaths.has(link)) {
      issues.push(issue('broken-link', entity, `${entity} links to unknown path: ${link}`))
    }
  }
}

function validateRichTextLinks(
  issues: ContentGraphIssue[],
  entity: string,
  body: RichTextDTO,
  knownPaths: Set<string>,
) {
  if (body.format !== 'markdown') {
    issues.push(issue('unsupported-richtext-format', entity, 'Unsupported RichText renderer: lexical requires the Payload renderer'))
    return
  }

  validateMarkdownLinks(issues, entity, body.value, knownPaths)
}

type RoutableEntity = {
  id: string
  path: string
  locale?: string
  slug?: string
  updatedAt?: string
  status?: string
  indexPolicy?: string
  seo?: {
    title?: string
    description?: string
    canonicalPath?: string
    robots?: string
    ogImage?: string
  }
}

function getRoutableEntities(repository: ContentRepositoryData) {
  return [
    ...repository.products.map((item) => ({ kind: 'product', item: item as RoutableEntity })),
    ...repository.pages.map((item) => ({ kind: 'page', item: item as RoutableEntity })),
    ...repository.cases.map((item) => ({ kind: 'case', item: item as RoutableEntity })),
    ...repository.articles.map((item) => ({ kind: 'article', item: item as RoutableEntity })),
    ...repository.knowledgeArticles.map((item) => ({ kind: 'knowledge', item: item as RoutableEntity })),
  ]
}

function validateGlobalIds(issues: ContentGraphIssue[], repository: ContentRepositoryData) {
  const ids = new Map<string, string>()
  const rows = [
    ...repository.products.map((item) => ({ entity: `product:${item.id}`, id: item.id })),
    ...repository.pages.map((item) => ({ entity: `page:${item.id}`, id: item.id })),
    ...repository.cases.map((item) => ({ entity: `case:${item.id}`, id: item.id })),
    ...repository.reviews.map((item) => ({ entity: `review:${item.id}`, id: item.id })),
    ...repository.tariffs.map((item) => ({ entity: `tariff:${item.id}`, id: item.id })),
    ...repository.calculations.map((item) => ({ entity: `calculation:${item.id}`, id: item.id })),
    ...repository.articles.map((item) => ({ entity: `article:${item.id}`, id: item.id })),
    ...repository.knowledgeArticles.map((item) => ({ entity: `knowledge:${item.id}`, id: item.id })),
  ]

  for (const row of rows) {
    const previous = ids.get(row.id)

    if (previous) {
      issues.push(issue('duplicate-global-id', row.entity, `${row.entity} duplicates global id from ${previous}.`))
      continue
    }

    ids.set(row.id, row.entity)
  }
}

function validateRoutableEntities(issues: ContentGraphIssue[], repository: ContentRepositoryData) {
  const localizedPaths = new Map<string, string>()

  for (const { kind, item } of getRoutableEntities(repository)) {
    const entity = `${kind}:${item.id}`
    const localizedPath = `${item.locale ?? 'ru-RU'}:${item.path}`
    const previousPathOwner = localizedPaths.get(localizedPath)

    if (previousPathOwner) {
      issues.push(issue('duplicate-canonical-path', entity, `${entity} duplicates canonical path from ${previousPathOwner}: ${item.path}`))
    } else {
      localizedPaths.set(localizedPath, entity)
    }

    if (item.seo?.canonicalPath !== item.path) {
      issues.push(issue('canonical-mismatch', entity, `${entity} SEO canonical must equal entity path.`))
    }

    if (item.slug && item.slug !== slugFromPath(item.path)) {
      issues.push(issue('slug-mismatch', entity, `${entity} slug must match the final canonical path segment.`))
    }

    if (item.seo && (!item.seo.title || !item.seo.description || !item.seo.canonicalPath)) {
      issues.push(issue('seo-incomplete', entity, `${entity} must have complete SEO title, description and canonicalPath.`))
    }

    if (item.status === 'published' && item.seo?.robots === 'noindex') {
      issues.push(issue('invalid-publication-state', entity, `${entity} is published but hidden from indexing.`))
    }

    if (item.status === 'draft' && item.seo?.robots !== 'noindex') {
      issues.push(issue('invalid-publication-state', entity, `${entity} is a draft but is not marked noindex.`))
    }

    if (item.status === 'published' && item.seo?.robots === 'index' && !item.updatedAt) {
      issues.push(issue('missing-updated-at', entity, `${entity} is sitemap-eligible but has no updatedAt.`))
    }

    if (item.indexPolicy && item.seo?.robots && item.indexPolicy !== item.seo.robots) {
      issues.push(issue('contradictory-index-policy', entity, `${entity} indexPolicy conflicts with SEO robots.`))
    }

    if (item.seo?.ogImage && !item.seo.ogImage.startsWith('/')) {
      issues.push(issue('invalid-media', entity, `${entity} ogImage must use a project-owned absolute path.`))
    }
  }
}

function validateProductRef(
  issues: ContentGraphIssue[],
  productIds: Set<string>,
  productId: string,
  entity: string,
) {
  if (!productIds.has(productId)) {
    issues.push(issue('broken-product-ref', entity, `${entity} references unknown product: ${productId}`))
  }
}

function validateEntityRefs(issues: ContentGraphIssue[], repository: ContentRepositoryData) {
  const productIds = new Set(repository.products.map((item) => item.id))

  for (const tariff of repository.tariffs) {
    validateProductRef(issues, productIds, tariff.productRef, `tariff:${tariff.id}`)
  }

  for (const item of repository.cases) {
    for (const productId of item.productRefs) {
      validateProductRef(issues, productIds, productId, `case:${item.id}`)
    }
  }

  for (const review of repository.reviews) {
    if (review.productRef) {
      validateProductRef(issues, productIds, review.productRef, `review:${review.id}`)
    }
  }

  for (const item of repository.calculations) {
    validateProductRef(issues, productIds, item.productRef, `calculation:${item.id}`)
  }

  for (const article of repository.articles) {
    for (const productId of article.productRefs) {
      validateProductRef(issues, productIds, productId, `article:${article.id}`)
    }
  }

  for (const article of repository.knowledgeArticles) {
    validateProductRef(issues, productIds, article.productRef, `knowledge:${article.id}`)
  }

  for (const page of repository.pages) {
    for (const block of page.blocks) {
      if (block.blockType === 'product-routes') {
        for (const productId of block.productRefs) {
          if (!productIds.has(productId)) {
            issues.push(issue('broken-block-ref', `page:${page.id}`, `page:${page.id} product-routes block references unknown product: ${productId}`))
          }
        }
      }
    }
  }
}

function validateNavigation(issues: ContentGraphIssue[], repository: ContentRepositoryData, knownPaths: Set<string>) {
  const navigationLinks = [
    ...repository.navigation.header.map((link) => ({ source: 'navigation:header', path: link.path })),
    ...Object.entries(repository.navigation.footer).flatMap(([group, links]) =>
      links.map((link) => ({ source: `navigation:footer:${group}`, path: link.path })),
    ),
    { source: 'navigation:primaryCta', path: repository.navigation.primaryCta.path },
  ]

  for (const link of navigationLinks) {
    const target = routeFromHref(link.path)

    if (!knownPaths.has(target)) {
      issues.push(issue('broken-navigation-ref', link.source, `${link.source} points to unknown path: ${link.path}`))
    }
  }
}

function validateRedirects(issues: ContentGraphIssue[], redirects: ContentGraphRedirect[] = []) {
  const sourceToDestination = new Map<string, string>()

  for (const rule of redirects) {
    let source: string
    let destination: string

    try {
      source = normalizePath(rule.source)
      destination = normalizePath(rule.destination)
    } catch (error) {
      const detail = error instanceof Error ? error.message : 'invalid canonical path'
      issues.push(issue('invalid-redirect', `redirect:${rule.source}`, `Redirect path is invalid: ${detail}`))
      continue
    }

    const entity = `redirect:${source}`

    if (source === destination) {
      issues.push(issue('invalid-redirect', entity, `${entity} points to itself.`))
    }

    if (sourceToDestination.has(source)) {
      issues.push(issue('invalid-redirect', entity, `${entity} duplicates another redirect source.`))
    }

    sourceToDestination.set(source, destination)
  }

  for (const [source, destination] of sourceToDestination) {
    if (sourceToDestination.has(destination)) {
      issues.push(issue('invalid-redirect', `redirect:${source}`, `Redirect chain is not allowed: ${source} -> ${destination}`))
    }
  }
}

function getArticlesForProduct(repository: ContentRepositoryData, productId: ProductDTO['id']) {
  return repository.articles.filter((item) => item.productRefs.includes(productId))
}

export async function validateContentGraph(
  repository: ContentRepository,
  options: ContentGraphValidationOptions = {},
): Promise<ContentGraphIssue[]> {
  const content = await loadContentRepository(repository)
  const issues: ContentGraphIssue[] = []
  const knownPaths = buildKnownPaths(content)
  const articleIntentIndex = new Map<string, string>()

  validateGlobalIds(issues, content)
  validateRoutableEntities(issues, content)
  validateEntityRefs(issues, content)
  validateNavigation(issues, content, knownPaths)
  validateRedirects(issues, options.redirects)

  for (const article of content.articles) {
    const entity = `article:${article.id}`
    const normalizedIntent = article.topic.trim().toLowerCase()
    const previous = articleIntentIndex.get(normalizedIntent)

    if (previous) {
      issues.push(
        issue(
          'duplicate-intent',
          entity,
          `Articles "${previous}" and "${article.id}" share the same intent/topic.`,
        ),
      )
    }

    articleIntentIndex.set(normalizedIntent, article.id)

    if (article.path.startsWith('/stati/tema/')) {
      issues.push(
        issue(
          'unsupported-topic-hub',
          entity,
          `Topic hub is not approved for first release: ${article.path}`,
        ),
      )
    }

    validateRichTextLinks(issues, entity, article.body, knownPaths)
  }

  for (const article of content.knowledgeArticles) {
    validateRichTextLinks(issues, `knowledge:${article.id}`, article.body, knownPaths)
  }

  for (const product of content.products) {
    const articles = getArticlesForProduct(content, product.id)
    const knowledgeItems = content.knowledgeArticles.filter((item) => item.productRef === product.id)

    if (articles.length === 0 || knowledgeItems.length === 0) {
      issues.push(
        issue(
          'orphan-product',
          `product:${product.id}`,
          `Product "${product.id}" needs at least one article and one KB item in the initial editorial graph.`,
        ),
      )
    }
  }

  return issues
}

export async function assertValidContentGraph(
  repository: ContentRepository,
  options: ContentGraphValidationOptions = {},
) {
  const issues = await validateContentGraph(repository, options)

  if (issues.length > 0) {
    throw new Error(`Content graph validation failed: ${issues.map((item) => item.message).join('; ')}`)
  }
}
