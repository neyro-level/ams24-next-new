import type { Metadata } from 'next'

import type { SeoDTO } from '@/core/content/schemas'

type MetadataOptions = {
  domain?: string
  locale?: string
  siteName?: string
  type?: 'website' | 'article'
}

type MetadataInput = Pick<SeoDTO, 'title' | 'description' | 'canonicalPath'> & Partial<Pick<SeoDTO, 'robots' | 'ogImage'>>

export function buildMetadata(seo: MetadataInput, options: MetadataOptions | string = {}): Metadata {
  const normalizedOptions = typeof options === 'string' ? { domain: options } : options
  const domain = normalizedOptions.domain ?? 'https://ams24.ru'
  const canonical = new URL(seo.canonicalPath, domain).toString()
  const siteName = normalizedOptions.siteName ?? 'Импульс'
  const locale = normalizedOptions.locale ?? 'ru_RU'

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
      siteName,
      locale,
      type: normalizedOptions.type ?? 'website',
      images: seo.ogImage ? [seo.ogImage] : undefined,
    },
    robots: {
      index: (seo.robots ?? 'index') === 'index',
      follow: true,
    },
  }
}

export function buildNoindexMetadata(seo: Omit<MetadataInput, 'robots'>, options?: MetadataOptions | string) {
  return buildMetadata({ ...seo, robots: 'noindex' }, options)
}
