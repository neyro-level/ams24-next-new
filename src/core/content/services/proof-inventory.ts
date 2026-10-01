import {
  getPublicProofEvidence as selectPublicProofEvidence,
  proofEvidenceInventory,
  type ProofInventoryItem as ProjectProofInventoryItem,
  type ProofInventoryKind as ProjectProofInventoryKind,
} from '@/project/proof-inventory'

export type ProofInventoryItem = ProjectProofInventoryItem
export type ProofInventoryKind = ProjectProofInventoryKind

export function getProofEvidenceInventory(): readonly ProofInventoryItem[] {
  return proofEvidenceInventory
}

export function getPublicProofEvidence() {
  return selectPublicProofEvidence()
}
