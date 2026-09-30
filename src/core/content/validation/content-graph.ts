import type { ContentRepository } from '@/core/content/repository'

export type ContentGraphIssueCode =
  | 'broken-link'
  | 'orphan-product'
  | 'duplicate-intent'
  | 'unsupported-topic-hub'

export type ContentGraphIssue = {
  code: ContentGraphIssueCode
  severity: 'error'
  entity: string
  message: string
}

const markdownLinkPattern = /\[[^\]]+\]\((\/[^)\s]+)\)/g

function normalizePath(path: string) {
  const withoutHash = path.split('#')[0]
  return withoutHash.endsWith('/') ? withoutHash : `${withoutHash}/`
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
    '/keisy/',
    '/stati/',
    '/baza-znaniy/',
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

export function validateContentGraph(repository: ContentRepository): ContentGraphIssue[] {
  const issues: ContentGraphIssue[] = []
  const knownPaths = buildKnownPaths(repository)
  const articleIntentIndex = new Map<string, string>()

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
    const articles = repository.getArticlesForProduct(product.id)
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

export function assertValidContentGraph(repository: ContentRepository) {
  const issues = validateContentGraph(repository)

  if (issues.length > 0) {
    throw new Error(`Content graph validation failed: ${issues.map((item) => item.message).join('; ')}`)
  }
}
