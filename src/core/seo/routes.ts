import type { ContentRepository } from '@/core/content/repository'

type RouteEntity = {
  path: string
  updatedAt?: string
  seo: {
    robots: 'index' | 'noindex'
  }
  status: 'draft' | 'published' | 'hidden'
}

export type SitemapEntry = {
  path: string
  lastModified: string
}

export function buildSitemapEntries(repository: ContentRepository): SitemapEntry[] {
  const entities: RouteEntity[] = [
    ...repository.products,
    ...repository.pages,
    ...repository.cases,
    ...repository.articles,
    ...repository.knowledgeArticles,
  ]

  return entities
    .filter((entity) => entity.status === 'published' && entity.seo.robots === 'index')
    .map((entity) => {
      if (!entity.updatedAt) {
        throw new Error(`Sitemap-eligible route requires updatedAt: ${entity.path}`)
      }

      return { path: entity.path, lastModified: entity.updatedAt }
    })
    .sort((left, right) => left.path.localeCompare(right.path))
}

export function buildSitemapPaths(repository: ContentRepository) {
  return buildSitemapEntries(repository).map((entry) => entry.path)
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
