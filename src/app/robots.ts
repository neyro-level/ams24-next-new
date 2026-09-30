import type { MetadataRoute } from 'next'

import { getSiteSettingsViewModel } from '@/core/content/services/view-models'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  const site = getSiteSettingsViewModel()

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: new URL('/sitemap.xml', site.siteOrigin).toString(),
    host: site.siteOrigin,
  }
}
