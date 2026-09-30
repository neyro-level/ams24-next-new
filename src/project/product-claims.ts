type ProductId = 'platform' | 'impuls' | 'pixel' | 'zashchita'

import {
  isPublicationAllowed,
  validatePublicationGateMatrix,
  type PublicationGateInput,
} from '@/core/content/services/publication-gate'

type EvidenceStatus =
  | 'project-verified'
  | 'owner-provided-needs-evidence'
  | 'legal-review-required'
  | 'unsupported-hidden'

type PublicationStatus = 'allowed' | 'needs-review' | 'hidden'

type ClaimRisk = 'low' | 'medium' | 'high'

export type ProductClaim = {
  id: string
  product: ProductId
  claim: string
  plannedUse: string
  evidenceStatus: EvidenceStatus
  evidence: string[]
  legalReviewRoute: string
  publicationStatus: PublicationStatus
  risk: ClaimRisk
}

export function toClaimPublicationGateInput(claim: ProductClaim): PublicationGateInput {
  return {
    id: claim.id,
    entity: 'claim',
    publicationStatus: claim.publicationStatus,
    evidenceState: claim.evidenceStatus,
    evidenceRefs: claim.evidence,
  }
}

export const productClaims: ProductClaim[] = [
  {
    id: 'platform-three-products',
    product: 'platform',
    claim: '«Импульс» объединяет три продукта: привлечение, пиксель и защиту лидов.',
    plannedUse: 'homepage, product switcher, product comparison blocks',
    evidenceStatus: 'project-verified',
    evidence: ['docs/01_PRD.md#1-product-summary', 'docs/02_PRODUCT_STRUCTURE.md#6-page-role-map'],
    legalReviewRoute: 'not-required: brand architecture claim',
    publicationStatus: 'allowed',
    risk: 'low',
  },
  {
    id: 'platform-operates-18-months',
    product: 'platform',
    claim: 'Продукт работает около 1,5 лет.',
    plannedUse: 'trust line only after owner evidence is attached',
    evidenceStatus: 'owner-provided-needs-evidence',
    evidence: ['docs/01_PRD.md#2-контекст-бизнеса'],
    legalReviewRoute: 'legal-review:OD-03 before public trust/proof copy',
    publicationStatus: 'needs-review',
    risk: 'medium',
  },
  {
    id: 'platform-many-cases-three-niches',
    product: 'platform',
    claim: 'Есть много кейсов в трёх нишах.',
    plannedUse: 'cases preview, proof layer',
    evidenceStatus: 'owner-provided-needs-evidence',
    evidence: ['docs/01_PRD.md#2-контекст-бизнеса', 'docs/04_BACKLOG.md#OD-01'],
    legalReviewRoute: 'legal-review:OD-03 + evidence inventory EPIC-06.1',
    publicationStatus: 'hidden',
    risk: 'high',
  },
  {
    id: 'impuls-operator-audiences',
    product: 'impuls',
    claim: '«Импульс» привлекает лиды через релевантные аудитории и возможности мобильных операторов.',
    plannedUse: '/impuls/ hero and mechanism block',
    evidenceStatus: 'legal-review-required',
    evidence: ['docs/01_PRD.md#1-product-summary', 'docs/02_PRODUCT_STRUCTURE.md#8-продуктовая-страница-impuls'],
    legalReviewRoute: 'legal-review:OD-03 operator/data wording before publication',
    publicationStatus: 'needs-review',
    risk: 'high',
  },
  {
    id: 'impuls-calculation-required',
    product: 'impuls',
    claim: 'Стоимость и применимость запуска рассчитываются по нише, региону и ограничениям.',
    plannedUse: '/impuls/ CTA and tariffs/calculation preview',
    evidenceStatus: 'project-verified',
    evidence: ['docs/01_PRD.md#12-business-rules', 'docs/02_PRODUCT_STRUCTURE.md#8-продуктовая-страница-impuls'],
    legalReviewRoute: 'commercial-review:OD-02 before exact tariff/pricing copy',
    publicationStatus: 'allowed',
    risk: 'medium',
  },
  {
    id: 'pixel-identifies-interested-visitors',
    product: 'pixel',
    claim: '«Импульс Пиксель» помогает определить часть заинтересованных посетителей собственного сайта.',
    plannedUse: '/pixel/ hero and data/result boundary block',
    evidenceStatus: 'legal-review-required',
    evidence: ['docs/01_PRD.md#1-product-summary', 'docs/02_PRODUCT_STRUCTURE.md#9-продуктовая-страница-pixel'],
    legalReviewRoute: 'legal-review:OD-03 privacy/data wording before publication',
    publicationStatus: 'needs-review',
    risk: 'high',
  },
  {
    id: 'pixel-not-all-visitors',
    product: 'pixel',
    claim: 'Пиксель не обещает полный охват аудитории сайта.',
    plannedUse: '/pixel/ limitations and FAQ',
    evidenceStatus: 'project-verified',
    evidence: ['docs/01_PRD.md#8-non-goals-первого-выпуска', 'docs/01_PRD.md#12-business-rules'],
    legalReviewRoute: 'legal-review:OD-03 confirms final limitation wording',
    publicationStatus: 'allowed',
    risk: 'medium',
  },
  {
    id: 'zashchita-reduces-risk',
    product: 'zashchita',
    claim: '«Импульс Защита» снижает риск перехвата лидов через аудит и меры защиты.',
    plannedUse: '/zashchita/ hero, audit process and protection measures',
    evidenceStatus: 'project-verified',
    evidence: ['docs/01_PRD.md#1-product-summary', 'docs/02_PRODUCT_STRUCTURE.md#10-продуктовая-страница-zashchita'],
    legalReviewRoute: 'legal-review:OD-03 for final risk/protection wording',
    publicationStatus: 'allowed',
    risk: 'high',
  },
  {
    id: 'zashchita-no-absolute-guarantee',
    product: 'zashchita',
    claim: 'Защита не гарантирует абсолютную невозможность перехвата.',
    plannedUse: '/zashchita/ limitations and FAQ',
    evidenceStatus: 'project-verified',
    evidence: ['docs/01_PRD.md#12-business-rules', 'docs/02_PRODUCT_STRUCTURE.md#10-продуктовая-страница-zashchita'],
    legalReviewRoute: 'legal-review:OD-03 confirms final limitation wording',
    publicationStatus: 'allowed',
    risk: 'high',
  },
  {
    id: 'forbidden-guaranteed-leads',
    product: 'platform',
    claim: 'Гарантированное количество лидов, фиксированный рост или универсальная цена контакта.',
    plannedUse: 'forbidden claim guard',
    evidenceStatus: 'unsupported-hidden',
    evidence: ['docs/01_PRD.md#8-non-goals-первого-выпуска', 'docs/01_PRD.md#12-business-rules'],
    legalReviewRoute: 'not-publishable: requires owner/legal/commercial decision before any use',
    publicationStatus: 'hidden',
    risk: 'high',
  },
  {
    id: 'forbidden-absolute-protection',
    product: 'zashchita',
    claim: 'Абсолютная защита от перехвата лидов.',
    plannedUse: 'forbidden claim guard',
    evidenceStatus: 'unsupported-hidden',
    evidence: ['docs/01_PRD.md#12-business-rules'],
    legalReviewRoute: 'not-publishable: contradicts project business rules',
    publicationStatus: 'hidden',
    risk: 'high',
  },
]

export function getClaimsForProduct(product: ProductId, claims: ProductClaim[] = productClaims) {
  return claims.filter((claim) => claim.product === product)
}

export function getPublicClaimsForProduct(product: ProductId, claims: ProductClaim[] = productClaims) {
  return getClaimsForProduct(product, claims).filter((claim) => isPublicationAllowed(toClaimPublicationGateInput(claim)))
}

export function validateProductClaimRegister(claims: ProductClaim[] = productClaims) {
  const issues: string[] = []
  issues.push(...validatePublicationGateMatrix(claims.map(toClaimPublicationGateInput)))

  for (const claim of claims) {
    if (claim.evidence.length === 0) {
      issues.push(`${claim.id}: missing evidence`)
    }

    if (!claim.legalReviewRoute) {
      issues.push(`${claim.id}: missing legal-review route`)
    }

    if (claim.evidenceStatus === 'unsupported-hidden' && claim.publicationStatus !== 'hidden') {
      issues.push(`${claim.id}: unsupported claim must remain hidden`)
    }

    if (claim.evidenceStatus === 'legal-review-required' && claim.publicationStatus === 'allowed') {
      issues.push(`${claim.id}: legal-review-required claim cannot be allowed before review`)
    }
  }

  return issues
}
