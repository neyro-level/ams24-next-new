import type { MetadataRoute } from 'next'

import { getContentRepository } from '@/core/content/services/repository'
import { getSiteSettingsViewModel } from '@/core/content/services/view-models'
import { buildSitemapEntries } from '@/core/seo'

export const dynamic = 'force-static'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const repository = getContentRepository()
  const site = await getSiteSettingsViewModel(repository)

  return (await buildSitemapEntries(repository)).map(({ path, lastModified }) => ({
    url: new URL(path, site.siteOrigin).toString(),
    lastModified,
  }))
}
