import type { Metadata } from 'next'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import CasesPage, { metadata as casesMetadata } from '@/app/keisy/page'
import ReviewsPage, { metadata as reviewsMetadata } from '@/app/otzyvy/page'
import CalculationsPage, { metadata as calculationsMetadata } from '@/app/raschety/page'
import TariffsPage, { metadata as tariffsMetadata } from '@/app/tarify/page'
import { createContentRepository } from '@/core/content/repository'
import { buildSitemapPaths } from '@/core/seo'
import { localContent } from '@/project/content/local-content'
import { proofEvidenceInventory } from '@/project/proof-inventory'
import { staticRouteSkeletons } from '@/project/route-skeletons'

type ProofHub = {
  path: string
  metadata: Metadata
  html: string
  inventoryKind: 'tariff' | 'case' | 'review' | 'calculation'
  expectedLinks: string[]
}

const proofHubs: ProofHub[] = [
  {
    path: '/tarify/',
    metadata: tariffsMetadata,
    html: renderToStaticMarkup(<TariffsPage />),
    inventoryKind: 'tariff',
    expectedLinks: ['href="/#lead-form"', 'href="/raschety"'],
  },
  {
    path: '/raschety/',
    metadata: calculationsMetadata,
    html: renderToStaticMarkup(<CalculationsPage />),
    inventoryKind: 'calculation',
    expectedLinks: ['href="/#lead-form"', 'href="/tarify"'],
  },
  {
    path: '/keisy/',
    metadata: casesMetadata,
    html: renderToStaticMarkup(<CasesPage />),
    inventoryKind: 'case',
    expectedLinks: ['href="/#lead-form"', 'href="/raschety"'],
  },
  {
    path: '/otzyvy/',
    metadata: reviewsMetadata,
    html: renderToStaticMarkup(<ReviewsPage />),
    inventoryKind: 'review',
    expectedLinks: ['href="/#lead-form"', 'href="/keisy"'],
  },
]

describe('proof hubs indexability guard', () => {
  it('keeps incomplete proof hubs noindex and out of sitemap', () => {
    const sitemapPaths = buildSitemapPaths(createContentRepository(localContent))

    for (const hub of proofHubs) {
      expect(hub.metadata.alternates?.canonical).toBe(new URL(hub.path, 'https://ams24.ru').toString())
      expect(hub.metadata.robots).toMatchObject({ index: false, follow: true })
      expect(sitemapPaths).not.toContain(hub.path)
      expect(staticRouteSkeletons.some((route) => route.path === hub.path)).toBe(false)
    }
  })

  it('renders non-empty guarded content instead of thin placeholder pages', () => {
    for (const hub of proofHubs) {
      const inventoryItems = proofEvidenceInventory.filter((item) => item.kind === hub.inventoryKind)

      expect(hub.html.match(/<h1\b/g), hub.path).toHaveLength(1)
      expect(hub.html).not.toContain('Route skeleton')
      expect(hub.html).not.toContain('Страница готовится к наполнению')
      expect(inventoryItems.length, `${hub.path} inventory items`).toBeGreaterThan(0)

      for (const item of inventoryItems) {
        expect(hub.html).toContain(item.title)
        expect(hub.html).toContain('hidden')
      }

      for (const expectedLink of hub.expectedLinks) {
        expect(hub.html).toContain(expectedLink)
      }
    }
  })
})
