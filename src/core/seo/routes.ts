import type { ContentRepository } from '@/core/content/repository'

type RouteEntity = {
  path: string
  seo: {
    robots: 'index' | 'noindex'
  }
  status: 'draft' | 'published' | 'hidden'
}

export function buildSitemapPaths(repository: ContentRepository) {
  const entities: RouteEntity[] = [
    ...repository.pages,
    ...repository.cases,
    ...repository.articles,
    ...repository.knowledgeArticles,
  ]

  return entities
    .filter((entity) => entity.status === 'published' && entity.seo.robots === 'index')
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
