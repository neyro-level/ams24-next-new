import { describe, expect, it } from 'vitest'

import {
  evaluatePublicationGate,
  validatePublicationGateMatrix,
  type PublicationGateInput,
} from '@/core/content/services/publication-gate'
import {
  getPublicClaimsForProduct,
  productClaims,
  toClaimPublicationGateInput,
  validateProductClaimRegister,
} from '@/project/product-claims'
import {
  getPublicProofEvidence,
  proofEvidenceInventory,
  toProofPublicationGateInput,
  validateProofEvidenceInventory,
} from '@/project/proof-inventory'

describe('publication evidence gate', () => {
  it('allows only verified public claims and denies review/hidden claim fixtures', () => {
    const decisions = productClaims.map((claim) => evaluatePublicationGate(toClaimPublicationGateInput(claim)))
    const allowedIds = decisions.filter((decision) => decision.allowed).map((decision) => decision.id)
    const deniedIds = decisions.filter((decision) => !decision.allowed).map((decision) => decision.id)

    expect(validateProductClaimRegister()).toEqual([])
    expect(allowedIds).toEqual([
      'platform-three-products',
      'impuls-calculation-required',
      'pixel-not-all-visitors',
      'zashchita-reduces-risk',
      'zashchita-no-absolute-guarantee',
    ])
    expect(deniedIds).toEqual(
      expect.arrayContaining([
        'platform-operates-18-months',
        'platform-many-cases-three-niches',
        'impuls-operator-audiences',
        'pixel-identifies-interested-visitors',
        'forbidden-guaranteed-leads',
        'forbidden-absolute-protection',
      ]),
    )

    expect(getPublicClaimsForProduct('impuls').map((claim) => claim.id)).toEqual(['impuls-calculation-required'])
    expect(getPublicClaimsForProduct('pixel').map((claim) => claim.id)).toEqual(['pixel-not-all-visitors'])
    expect(getPublicClaimsForProduct('zashchita').map((claim) => claim.id)).toEqual([
      'zashchita-reduces-risk',
      'zashchita-no-absolute-guarantee',
    ])
  })

  it('denies proof inventory until evidence, permission and blockers are clean', () => {
    expect(validateProofEvidenceInventory()).toEqual([])

    for (const item of proofEvidenceInventory) {
      const decision = evaluatePublicationGate(toProofPublicationGateInput(item))

      expect(decision.allowed, item.id).toBe(false)
      expect(decision.reasons.length, item.id).toBeGreaterThan(0)
    }

    expect(getPublicProofEvidence()).toEqual([])
  })

  it('documents allowed and denied proof evidence matrix fixtures', () => {
    const matrix: PublicationGateInput[] = [
      {
        id: 'allowed-claim',
        entity: 'claim',
        publicationStatus: 'allowed',
        evidenceState: 'project-verified',
        evidenceRefs: ['docs/01_PRD.md#1-product-summary'],
      },
      {
        id: 'denied-claim-review-evidence',
        entity: 'claim',
        publicationStatus: 'allowed',
        evidenceState: 'legal-review-required',
        evidenceRefs: ['docs/01_PRD.md#1-product-summary'],
      },
      {
        id: 'allowed-proof',
        entity: 'proof',
        publicationStatus: 'publishable',
        evidenceState: 'verified',
        evidenceRefs: ['docs/research/example.md#evidence'],
        permissionState: 'anonymized-approved',
        blockers: [],
      },
      {
        id: 'denied-proof-missing-permission',
        entity: 'proof',
        publicationStatus: 'publishable',
        evidenceState: 'verified',
        evidenceRefs: ['docs/research/example.md#evidence'],
        permissionState: 'not-requested',
        blockers: [],
      },
      {
        id: 'denied-proof-blocked',
        entity: 'proof',
        publicationStatus: 'publishable',
        evidenceState: 'verified',
        evidenceRefs: ['docs/research/example.md#evidence'],
        permissionState: 'approved',
        blockers: ['OD-02'],
      },
    ]

    expect(matrix.map((item) => [item.id, evaluatePublicationGate(item).allowed])).toEqual([
      ['allowed-claim', true],
      ['denied-claim-review-evidence', false],
      ['allowed-proof', true],
      ['denied-proof-missing-permission', false],
      ['denied-proof-blocked', false],
    ])
    expect(validatePublicationGateMatrix(matrix)).toEqual([
      'denied-claim-review-evidence: claim evidence is legal-review-required',
      'denied-proof-missing-permission: proof permission is not-requested',
      'denied-proof-blocked: proof blockers: OD-02',
    ])
  })
})
