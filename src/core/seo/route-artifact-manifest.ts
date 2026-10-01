import type { ContentRepository } from '@/core/content/repository'
import type { Locale } from '@/core/content/schemas'
import { getDetailFixtures } from '@/core/content/services/detail-fixtures'
import {
  getRepresentativeArticleContract,
  getRepresentativeKnowledgeContract,
} from '@/core/content/services/editorial-contracts'
import { getContentRepository } from '@/core/content/services/repository'
import { getStaticRouteSkeletons } from '@/core/content/services/route-skeletons'
import { getRequiredSiteSettings } from '@/core/content/services/site-settings'
import { normalizePath } from '@/core/lib/path'
import { additionalStaticArtifactRoutes } from '@/project/content/artifact-routes'

export type RouteArtifactEntry = {
  path: string
  canonicalUrl: string
  locale: Locale
  indexPolicy: 'index' | 'noindex'
  h1: { count: 1 }
}

export type RouteArtifactManifest = {
  schema: 'ams-route-artifact-v1'
  site: {
    origin: string
    locale: Locale
    siteName: string
  }
  routes: RouteArtifactEntry[]
}

type RouteInput = {
  path: string
  locale: Locale
  indexPolicy: 'index' | 'noindex'
}

export async function buildRouteArtifactManifest(
  repository: ContentRepository = getContentRepository(),
): Promise<RouteArtifactManifest> {
  const [settings, products, pages, articles, knowledgeArticles] = await Promise.all([
    getRequiredSiteSettings(repository),
    repository.getProducts(),
    repository.getPages(),
    repository.getArticles(),
    repository.getKnowledgeArticles(),
  ])

  const repositoryRoutes: RouteInput[] = [
    ...products.map((item) => ({ path: item.path, locale: item.locale, indexPolicy: item.seo.robots })),
    ...pages.map((item) => ({ path: item.path, locale: item.locale, indexPolicy: item.seo.robots })),
    ...articles
      .filter((item) => item.status === 'published')
      .map((item) => ({ path: item.path, locale: item.locale, indexPolicy: item.seo.robots })),
    ...knowledgeArticles
      .filter((item) => item.status === 'published')
      .map((item) => ({ path: item.path, locale: item.locale, indexPolicy: item.seo.robots })),
  ]
  const contractRoutes: RouteInput[] = [
    ...getStaticRouteSkeletons().map((item) => ({
      path: item.path,
      locale: settings.locale,
      indexPolicy: 'noindex' as const,
    })),
    ...additionalStaticArtifactRoutes.map((path) => ({
      path,
      locale: settings.locale,
      indexPolicy: 'noindex' as const,
    })),
    ...getDetailFixtures()
      .filter((item) => item.type === 'case')
      .map((item) => ({
        path: item.path,
        locale: settings.locale,
        indexPolicy: 'noindex' as const,
      })),
    {
      path: `/stati/${getRepresentativeArticleContract().slug}/`,
      locale: settings.locale,
      indexPolicy: 'noindex' as const,
    },
    {
      path: `/baza-znaniy/${getRepresentativeKnowledgeContract().product}/${getRepresentativeKnowledgeContract().slug}/`,
      locale: settings.locale,
      indexPolicy: 'noindex' as const,
    },
  ]
  const byPath = new Map<string, RouteInput>()

  for (const route of [...repositoryRoutes, ...contractRoutes]) {
    const path = normalizePath(route.path)
    if (byPath.has(path)) throw new Error(`Route artifact manifest contains duplicate canonical path: ${path}`)
    byPath.set(path, { ...route, path })
  }

  const routes = [...byPath.values()]
    .map<RouteArtifactEntry>((route) => ({
      path: route.path,
      canonicalUrl: new URL(route.path, settings.domain).toString(),
      locale: route.locale,
      indexPolicy: route.indexPolicy,
      h1: { count: 1 },
    }))
    .sort((left, right) => left.path.localeCompare(right.path))

  return {
    schema: 'ams-route-artifact-v1',
    site: { origin: settings.domain, locale: settings.locale, siteName: settings.siteName },
    routes,
  }
}
