import type { ContentRepository } from '@/core/content/repository'

type EditorialGraphIssue = {
  code: 'broken-link' | 'orphan-product' | 'duplicate-intent' | 'unsupported-topic-hub'
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
    ...repository.articles.map((item) => item.path),
    ...repository.knowledgeArticles.map((item) => item.path),
    '/stati/',
    '/baza-znaniy/',
  ])
}

export function validateEditorialLinkGraph(repository: ContentRepository): EditorialGraphIssue[] {
  const issues: EditorialGraphIssue[] = []
  const knownPaths = buildKnownPaths(repository)
  const articleIntentIndex = new Map<string, string>()

  for (const article of repository.articles) {
    const normalizedIntent = article.topic.trim().toLowerCase()
    const previous = articleIntentIndex.get(normalizedIntent)

    if (previous) {
      issues.push({
        code: 'duplicate-intent',
        message: `Articles "${previous}" and "${article.id}" share the same intent/topic.`,
      })
    }

    articleIntentIndex.set(normalizedIntent, article.id)

    if (article.path.startsWith('/stati/tema/')) {
      issues.push({
        code: 'unsupported-topic-hub',
        message: `Topic hub is not approved for first release: ${article.path}`,
      })
    }

    for (const link of extractInternalLinks(article.body.value)) {
      if (!knownPaths.has(link)) {
        issues.push({
          code: 'broken-link',
          message: `Article "${article.id}" links to unknown path: ${link}`,
        })
      }
    }
  }

  for (const article of repository.knowledgeArticles) {
    for (const link of extractInternalLinks(article.body.value)) {
      if (!knownPaths.has(link)) {
        issues.push({
          code: 'broken-link',
          message: `Knowledge article "${article.id}" links to unknown path: ${link}`,
        })
      }
    }
  }

  for (const product of repository.products) {
    const articles = repository.getArticlesForProduct(product.id)
    const knowledgeItems = repository.knowledgeArticles.filter((item) => item.productRef === product.id)

    if (articles.length === 0 || knowledgeItems.length === 0) {
      issues.push({
        code: 'orphan-product',
        message: `Product "${product.id}" needs at least one article and one KB item in the initial editorial graph.`,
      })
    }
  }

  return issues
}
