import type { Metadata } from 'next'

import type { SeoDTO } from '@/core/content/schemas'

export function buildMetadata(seo: SeoDTO, domain = 'https://ams24.ru'): Metadata {
  const canonical = new URL(seo.canonicalPath, domain).toString()

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
      images: seo.ogImage ? [seo.ogImage] : undefined,
    },
    robots: {
      index: seo.robots === 'index',
      follow: true,
    },
  }
}
