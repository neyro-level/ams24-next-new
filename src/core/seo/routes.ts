import type { ContentRepository } from '@/core/content/repository'
import { normalizePath } from '@/core/lib/path'

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

export async function buildSitemapEntries(repository: ContentRepository): Promise<SitemapEntry[]> {
  const [products, pages, cases, articles, knowledgeArticles] = await Promise.all([
    repository.getProducts(),
    repository.getPages(),
    repository.getCases(),
    repository.getArticles(),
    repository.getKnowledgeArticles(),
  ])
  const entities: RouteEntity[] = [
    ...products,
    ...pages,
    ...cases,
    ...articles,
    ...knowledgeArticles,
  ]

  return entities
    .filter((entity) => entity.status === 'published' && entity.seo.robots === 'index')
    .map((entity) => {
      if (!entity.updatedAt) {
        throw new Error(`Sitemap-eligible route requires updatedAt: ${entity.path}`)
      }

      return { path: normalizePath(entity.path), lastModified: entity.updatedAt }
    })
    .sort((left, right) => left.path.localeCompare(right.path))
}

export async function buildSitemapPaths(repository: ContentRepository) {
  return (await buildSitemapEntries(repository)).map((entry) => entry.path)
}

export function pathToSlugParams(path: string, prefix: string) {
  const normalizedPath = normalizePath(path)
  const normalizedPrefix = normalizePath(prefix)

  if (!normalizedPath.startsWith(normalizedPrefix)) {
    throw new Error(`Path "${normalizedPath}" does not belong to prefix "${normalizedPrefix}"`)
  }

  return {
    slug: normalizedPath
      .slice(normalizedPrefix.length)
      .replace(/\/$/, '')
      .split('/')
      .filter(Boolean),
  }
}

export function buildStaticParams(paths: string[], prefix: string) {
  return paths.map((path) => pathToSlugParams(path, prefix))
}
