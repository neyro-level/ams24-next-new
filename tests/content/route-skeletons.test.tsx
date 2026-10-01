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
} from '@/core/content/services/route-skeletons'
import { localContent } from '@/project/content/local-content'
import { RouteSkeletonPage } from '@/ui/shell/route-skeleton-page'

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
      const metadata = await buildSkeletonMetadata(route)
      const html = renderToStaticMarkup(<RouteSkeletonPage route={route} />)

      expect(metadata.robots).toMatchObject({ index: false, follow: true })
      expect(sitemapPaths).not.toContain(route.path)
      expect(html).toContain('Страница готовится')
      expect(html).toContain('Публикация')
    }
  })

  it('declares only repository-backed dynamic route types', () => {
    expect(dynamicRouteTypes).toEqual([
      '/stati/[slug]/',
      '/baza-znaniy/[product]/[slug]/',
    ])

    expect(existsSync(join(process.cwd(), 'src/app/keisy/[slug]/page.tsx'))).toBe(false)
    expect(existsSync(join(process.cwd(), 'src/app/stati/[slug]/page.tsx'))).toBe(true)
    expect(existsSync(join(process.cwd(), 'src/app/baza-znaniy/[product]/[slug]/page.tsx'))).toBe(true)
  })

})
