import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { createContentRepository } from '@/core/content/repository'
import { buildSitemapPaths } from '@/core/seo'
import {
  buildSkeletonMetadata,
  dynamicRouteTypes,
  staticRouteSkeletons,
} from '@/project/route-skeletons'
import { localContent } from '@/project/content/local-content'
import { RouteSkeletonPage } from '@/ui/shell/route-skeleton-page'
import { buildDetailFixtureMetadata, detailFixtures } from '@/project/detail-fixtures'
import { DetailFixturePage } from '@/ui/shell/detail-fixture-page'

const routeFileByPath = new Map([
  ['/', 'src/app/page.tsx'],
  ...staticRouteSkeletons.map((route) => [route.path, `src/app/${route.path.replace(/^\/|\/$/g, '')}/page.tsx`] as const),
])

describe('route skeleton visibility controls', () => {
  it('has a build route file for each agreed static route skeleton', () => {
    for (const [route, file] of routeFileByPath) {
      expect(existsSync(join(process.cwd(), file)), `${route} -> ${file}`).toBe(true)
    }
  })

  it('keeps unfinished skeleton routes noindex and absent from sitemap', async () => {
    const repository = createContentRepository(localContent)
    const sitemapPaths = await buildSitemapPaths(repository)

    for (const route of staticRouteSkeletons) {
      const metadata = buildSkeletonMetadata(route)
      const html = renderToStaticMarkup(<RouteSkeletonPage route={route} />)

      expect(metadata.robots).toMatchObject({ index: false, follow: true })
      expect(sitemapPaths).not.toContain(route.path)
      expect(html).toContain('Страница готовится')
      expect(html).toContain('Публикация')
    }
  })

  it('declares dynamic route types with representative static fixtures', () => {
    expect(dynamicRouteTypes).toEqual([
      '/keisy/[slug]/',
      '/stati/[slug]/',
      '/baza-znaniy/[product]/[slug]/',
    ])

    expect(existsSync(join(process.cwd(), 'src/app/keisy/[slug]/page.tsx'))).toBe(true)
    expect(existsSync(join(process.cwd(), 'src/app/stati/[slug]/page.tsx'))).toBe(true)
    expect(existsSync(join(process.cwd(), 'src/app/baza-znaniy/[product]/[slug]/page.tsx'))).toBe(true)
  })

  it('renders representative detail fixtures with breadcrumbs, related links and noindex metadata', () => {
    for (const fixture of detailFixtures) {
      const metadata = buildDetailFixtureMetadata(fixture)
      const html = renderToStaticMarkup(<DetailFixturePage fixture={fixture} />)

      expect(metadata.robots).toMatchObject({ index: false, follow: true })
      expect(html).toContain('aria-label="Хлебные крошки"')
      expect(html).toContain('aria-label="Связанные маршруты"')
      expect(html).toContain(fixture.title)
    }
  })
})
