import type { Metadata } from 'next'

import type { SeoDTO, SiteSettingsDTO } from '@/core/content/schemas'
import { requireSiteSettings } from '@/core/content/validation/site-settings'

type MetadataOptions = {
  type?: 'website' | 'article'
}

type MetadataInput = Pick<SeoDTO, 'title' | 'description' | 'canonicalPath'> & Partial<Pick<SeoDTO, 'robots' | 'ogImage'>>

export function buildMetadata(
  seoInput: MetadataInput | undefined,
  settingsInput: SiteSettingsDTO,
  options: MetadataOptions = {},
): Metadata {
  const settings = requireSiteSettings(settingsInput)
  const seo = seoInput ?? settings.defaultSeo
  const canonical = new URL(seo.canonicalPath, settings.domain).toString()

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: canonical,
      siteName: settings.siteName,
      locale: settings.locale.replace('-', '_'),
      type: options.type ?? 'website',
      images: seo.ogImage ? [seo.ogImage] : undefined,
    },
    robots: {
      index: (seo.robots ?? 'index') === 'index',
      follow: true,
    },
  }
}

export function buildNoindexMetadata(
  seo: Omit<MetadataInput, 'robots'>,
  settings: SiteSettingsDTO,
  options?: MetadataOptions,
) {
  return buildMetadata({ ...seo, robots: 'noindex' }, settings, options)
}
