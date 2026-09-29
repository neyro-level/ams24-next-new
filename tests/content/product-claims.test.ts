import { describe, expect, it } from 'vitest'

import { getClaimsForProduct, productClaims, validateProductClaimRegister } from '@/project/product-claims'

describe('product claim register', () => {
  it('assigns evidence, status and legal-review route to every planned claim', () => {
    expect(productClaims.length).toBeGreaterThanOrEqual(10)
    expect(validateProductClaimRegister()).toEqual([])

    for (const claim of productClaims) {
      expect(claim.evidence.length).toBeGreaterThan(0)
      expect(claim.legalReviewRoute.length).toBeGreaterThan(5)
      expect(claim.plannedUse.length).toBeGreaterThan(10)
    }
  })

  it('covers the three product pages and keeps unsupported claims hidden', () => {
    expect(getClaimsForProduct('impuls').length).toBeGreaterThan(0)
    expect(getClaimsForProduct('pixel').length).toBeGreaterThan(0)
    expect(getClaimsForProduct('zashchita').length).toBeGreaterThan(0)

    for (const claim of productClaims) {
      if (claim.evidenceStatus === 'unsupported-hidden') {
        expect(claim.publicationStatus).toBe('hidden')
      }

      if (claim.evidenceStatus === 'legal-review-required') {
        expect(claim.publicationStatus).not.toBe('allowed')
        expect(claim.legalReviewRoute).toContain('OD-03')
      }
    }
  })
})
