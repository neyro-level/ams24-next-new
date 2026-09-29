import { describe, expect, it } from 'vitest'

import { proofEvidenceInventory, validateProofEvidenceInventory } from '@/project/proof-inventory'

describe('EPIC-06 proof evidence inventory', () => {
  it('classifies every planned proof/commercial item with evidence and permission state', () => {
    expect(validateProofEvidenceInventory()).toEqual([])

    for (const item of proofEvidenceInventory) {
      expect(item.evidenceRefs.length, `${item.id} evidence refs`).toBeGreaterThan(0)
      expect(item.permissionState, `${item.id} permission state`).toBeTruthy()
      expect(item.productRefs.length, `${item.id} product refs`).toBeGreaterThan(0)
      expect(item.plannedRoute, `${item.id} planned route`).toMatch(/^\/.+\/$/)
    }
  })

  it('keeps incomplete or blocked items hidden until owner evidence is attached', () => {
    for (const item of proofEvidenceInventory) {
      if (item.evidenceState !== 'verified' || item.blockers.length > 0 || item.permissionState === 'not-requested') {
        expect(item.publicationStatus, `${item.id} publication status`).toBe('hidden')
        expect(item.hiddenReason, `${item.id} hidden reason`).toBeTruthy()
      }
    }
  })

  it('reserves the approved first-release minimum without publishing thin proof', () => {
    const cases = proofEvidenceInventory.filter((item) => item.kind === 'case')
    const reviews = proofEvidenceInventory.filter((item) => item.kind === 'review')
    const tariffs = proofEvidenceInventory.filter((item) => item.kind === 'tariff')
    const calculations = proofEvidenceInventory.filter((item) => item.kind === 'calculation')

    expect(cases.map((item) => item.releaseMinimumSlot)).toEqual(['case-1', 'case-2', 'case-3'])
    expect(reviews.map((item) => item.releaseMinimumSlot)).toEqual(['review-1', 'review-2', 'review-3'])
    expect(tariffs).toHaveLength(3)
    expect(calculations).toHaveLength(1)

    expect([...cases, ...reviews].every((item) => item.publicationStatus === 'hidden')).toBe(true)
    expect([...tariffs, ...calculations].every((item) => item.blockers.includes('OD-02'))).toBe(true)
  })

  it('rejects publishable items without verified evidence, permission and clean blockers', () => {
    expect(
      validateProofEvidenceInventory([
        {
          ...proofEvidenceInventory[0],
          id: 'bad-publishable-proof',
          evidenceState: 'missing',
          permissionState: 'not-requested',
          blockers: ['OD-02'],
          publicationStatus: 'publishable',
          hiddenReason: undefined,
        },
      ]),
    ).toEqual(
      expect.arrayContaining([
        'bad-publishable-proof: publishable item must have verified evidence',
        'bad-publishable-proof: publishable item must have approved permission state',
        'bad-publishable-proof: publishable item cannot have blockers',
      ]),
    )
  })
})
