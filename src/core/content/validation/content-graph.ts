import type { ContentRepository } from '@/core/content/repository'
import type { ProductDTO } from '@/core/content/schemas'

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
  | 'seo-incomplete'
  | 'contradictory-index-policy'

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

function normalizePath(path: string) {
  const withoutHash = path.split('#')[0]
  return withoutHash.endsWith('/') ? withoutHash : `${withoutHash}/`
}

function routeFromHref(href: string) {
  return normalizePath(href.split('#')[0] || '/')
}

function slugFromPath(path: string) {
  const segments = path.split('/').filter(Boolean)
  return segments.at(-1) ?? ''
}

function extractInternalLinks(markdown: string) {
  const links = new Set<string>()
  let match: RegExpExecArray | null

  while ((match = markdownLinkPattern.exec(markdown))) {
    links.add(normalizePath(match[1]))
  }

  return [...links]
}

function buildKnownPaths(repository: ContentRepository) {
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

type RoutableEntity = {
  id: string
  path: string
  locale?: string
  slug?: string
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

function getRoutableEntities(repository: ContentRepository) {
  return [
    ...repository.products.map((item) => ({ kind: 'product', item: item as RoutableEntity })),
    ...repository.pages.map((item) => ({ kind: 'page', item: item as RoutableEntity })),
    ...repository.cases.map((item) => ({ kind: 'case', item: item as RoutableEntity })),
    ...repository.articles.map((item) => ({ kind: 'article', item: item as RoutableEntity })),
    ...repository.knowledgeArticles.map((item) => ({ kind: 'knowledge', item: item as RoutableEntity })),
  ]
}

function validateGlobalIds(issues: ContentGraphIssue[], repository: ContentRepository) {
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

function validateRoutableEntities(issues: ContentGraphIssue[], repository: ContentRepository) {
  const paths = new Map<string, string>()

  for (const { kind, item } of getRoutableEntities(repository)) {
    const entity = `${kind}:${item.id}`
    const previousPathOwner = paths.get(item.path)

    if (previousPathOwner) {
      issues.push(issue('duplicate-canonical-path', entity, `${entity} duplicates canonical path from ${previousPathOwner}: ${item.path}`))
    } else {
      paths.set(item.path, entity)
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

    if (item.indexPolicy && item.seo?.robots && item.indexPolicy !== item.seo.robots) {
      issues.push(issue('contradictory-index-policy', entity, `${entity} indexPolicy conflicts with SEO robots.`))
    }

    if (item.seo?.ogImage && !item.seo.ogImage.startsWith('/')) {
      issues.push(issue('invalid-media', entity, `${entity} ogImage must use a project-owned absolute path.`))
    }
  }
}

function assertProductRef(
  issues: ContentGraphIssue[],
  productIds: Set<string>,
  productId: string,
  entity: string,
) {
  if (!productIds.has(productId)) {
    issues.push(issue('broken-product-ref', entity, `${entity} references unknown product: ${productId}`))
  }
}

function validateEntityRefs(issues: ContentGraphIssue[], repository: ContentRepository) {
  const productIds = new Set(repository.products.map((item) => item.id))

  for (const tariff of repository.tariffs) {
    assertProductRef(issues, productIds, tariff.productRef, `tariff:${tariff.id}`)
  }

  for (const item of repository.cases) {
    for (const productId of item.productRefs) {
      assertProductRef(issues, productIds, productId, `case:${item.id}`)
    }
  }

  for (const review of repository.reviews) {
    if (review.productRef) {
      assertProductRef(issues, productIds, review.productRef, `review:${review.id}`)
    }
  }

  for (const item of repository.calculations) {
    assertProductRef(issues, productIds, item.productRef, `calculation:${item.id}`)
  }

  for (const article of repository.articles) {
    for (const productId of article.productRefs) {
      assertProductRef(issues, productIds, productId, `article:${article.id}`)
    }
  }

  for (const article of repository.knowledgeArticles) {
    assertProductRef(issues, productIds, article.productRef, `knowledge:${article.id}`)
  }

  for (const page of repository.pages) {
    for (const block of page.blocks) {
      if (block.type === 'product-routes') {
        for (const productId of block.productRefs) {
          if (!productIds.has(productId)) {
            issues.push(issue('broken-block-ref', `page:${page.id}`, `page:${page.id} product-routes block references unknown product: ${productId}`))
          }
        }
      }
    }
  }
}

function validateNavigation(issues: ContentGraphIssue[], repository: ContentRepository, knownPaths: Set<string>) {
  if (!repository.navigation) {
    return
  }

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
    const source = normalizePath(rule.source)
    const destination = normalizePath(rule.destination)
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

function getArticlesForProduct(repository: ContentRepository, productId: ProductDTO['id']) {
  return repository.articles.filter((item) => item.productRefs.includes(productId))
}

export function validateContentGraph(
  repository: ContentRepository,
  options: ContentGraphValidationOptions = {},
): ContentGraphIssue[] {
  const issues: ContentGraphIssue[] = []
  const knownPaths = buildKnownPaths(repository)
  const articleIntentIndex = new Map<string, string>()

  validateGlobalIds(issues, repository)
  validateRoutableEntities(issues, repository)
  validateEntityRefs(issues, repository)
  validateNavigation(issues, repository, knownPaths)
  validateRedirects(issues, options.redirects)

  for (const article of repository.articles) {
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

    validateMarkdownLinks(issues, entity, article.body.value, knownPaths)
  }

  for (const article of repository.knowledgeArticles) {
    validateMarkdownLinks(issues, `knowledge:${article.id}`, article.body.value, knownPaths)
  }

  for (const product of repository.products) {
    const articles = getArticlesForProduct(repository, product.id)
    const knowledgeItems = repository.knowledgeArticles.filter((item) => item.productRef === product.id)

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

export function assertValidContentGraph(
  repository: ContentRepository,
  options: ContentGraphValidationOptions = {},
) {
  const issues = validateContentGraph(repository, options)

  if (issues.length > 0) {
    throw new Error(`Content graph validation failed: ${issues.map((item) => item.message).join('; ')}`)
  }
}
