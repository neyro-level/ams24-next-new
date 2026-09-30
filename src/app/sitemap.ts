import type { MetadataRoute } from 'next'

import { getContentRepository } from '@/core/content/services/repository'
import { getSiteSettingsViewModel } from '@/core/content/services/view-models'
import { buildSitemapPaths } from '@/core/seo'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const repository = getContentRepository()
  const site = getSiteSettingsViewModel(repository)

  return buildSitemapPaths(repository).map((path) => ({
    url: new URL(path, site.siteOrigin).toString(),
  }))
}
