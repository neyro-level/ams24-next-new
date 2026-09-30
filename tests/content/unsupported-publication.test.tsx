import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import HomePage, { metadata as homeMetadata } from '@/app/page'
import ImpulsProductPage, { metadata as impulsMetadata } from '@/app/impuls/page'
import PixelProductPage, { metadata as pixelMetadata } from '@/app/pixel/page'
import ZashchitaProductPage, { metadata as zashchitaMetadata } from '@/app/zashchita/page'
import {
  getPublicClaimsForProduct,
  productClaims,
  validateProductClaimRegister,
  type ProductClaim,
} from '@/project/product-claims'
import { proofEvidenceInventory, validateProofEvidenceInventory } from '@/project/proof-inventory'

const indexableRoutes = [
  { path: '/', html: () => renderToStaticMarkup(<HomePage />), metadata: homeMetadata },
  { path: '/impuls/', html: () => renderToStaticMarkup(<ImpulsProductPage />), metadata: impulsMetadata },
  { path: '/pixel/', html: () => renderToStaticMarkup(<PixelProductPage />), metadata: pixelMetadata },
  { path: '/zashchita/', html: () => renderToStaticMarkup(<ZashchitaProductPage />), metadata: zashchitaMetadata },
] as const

describe('unsupported publication regressions', () => {
  it('keeps denied claims and internal review routes out of indexable UI', () => {
    const deniedClaims = productClaims.filter((claim) => claim.publicationStatus !== 'allowed')

    for (const route of indexableRoutes) {
      expect(route.metadata.robots).toMatchObject({ index: true, follow: true })

      const html = route.html()

      for (const claim of deniedClaims) {
        expect(html, `${route.path} must not render denied claim ${claim.id}`).not.toContain(claim.claim)
        expect(html, `${route.path} must not render review route ${claim.id}`).not.toContain(claim.legalReviewRoute)
      }

      expect(html, `${route.path} must not expose unsupported marker`).not.toContain('unsupported-hidden')
      expect(html, `${route.path} must not expose OD marker`).not.toMatch(/OD-\d+/)
    }
  })

  it('rejects unsupported claim fixtures even when accidentally marked allowed', () => {
    const badClaim: ProductClaim = {
      ...productClaims.find((claim) => claim.id === 'forbidden-guaranteed-leads')!,
      id: 'bad-allowed-unsupported-claim',
      publicationStatus: 'allowed',
    }

    const fixture = [...productClaims, badClaim]

    expect(getPublicClaimsForProduct('platform', fixture).map((claim) => claim.id)).not.toContain(
      'bad-allowed-unsupported-claim',
    )
    expect(validateProductClaimRegister(fixture)).toEqual(
      expect.arrayContaining([
        'bad-allowed-unsupported-claim: claim evidence is unsupported-hidden',
        'bad-allowed-unsupported-claim: unsupported claim must remain hidden',
      ]),
    )
  })

  it('rejects proof fixtures that try to publish without evidence, permission and clean blockers', () => {
    expect(
      validateProofEvidenceInventory([
        {
          ...proofEvidenceInventory.find((item) => item.id === 'case-release-niche-1-impuls')!,
          id: 'bad-indexable-case-proof',
          publicationStatus: 'publishable',
          hiddenReason: undefined,
        },
      ]),
    ).toEqual(
      expect.arrayContaining([
        'bad-indexable-case-proof: proof evidence is missing; proof permission is not-requested; proof blockers: OD-01, case-source, case-period, case-methodology, publication-permission',
        'bad-indexable-case-proof: publishable item must have verified evidence',
        'bad-indexable-case-proof: publishable item must have approved permission state',
        'bad-indexable-case-proof: publishable item cannot have blockers',
      ]),
    )
  })
})
