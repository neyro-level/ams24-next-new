import type { ContentRepository } from '@/core/content/repository'

type RouteEntity = {
  path: string
  seo: {
    robots: 'index' | 'noindex'
  }
  status: 'active' | 'draft' | 'published' | 'hidden' | 'planned'
}

export function buildSitemapPaths(repository: ContentRepository) {
  const entities: RouteEntity[] = [
    ...repository.products,
    ...repository.pages,
    ...repository.cases,
    ...repository.articles,
    ...repository.knowledgeArticles,
  ]

  return entities
    .filter((entity) => ['active', 'published'].includes(entity.status) && entity.seo.robots === 'index')
    .map((entity) => entity.path)
    .sort()
}

export function pathToSlugParams(path: string, prefix: string) {
  const normalizedPrefix = prefix.endsWith('/') ? prefix : `${prefix}/`

  if (!path.startsWith(normalizedPrefix)) {
    throw new Error(`Path "${path}" does not belong to prefix "${normalizedPrefix}"`)
  }

  return {
    slug: path
      .slice(normalizedPrefix.length)
      .replace(/\/$/, '')
      .split('/')
      .filter(Boolean),
  }
}

export function buildStaticParams(paths: string[], prefix: string) {
  return paths.map((path) => pathToSlugParams(path, prefix))
}
