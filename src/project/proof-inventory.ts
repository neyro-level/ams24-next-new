import type { ProductId } from '@/core/content/schemas'
import {
  isPublicationAllowed,
  validatePublicationGateMatrix,
  type PublicationGateInput,
} from '@/core/content/services/publication-gate'

export type ProofInventoryKind = 'tariff' | 'case' | 'review' | 'calculation'
export type EvidenceState = 'verified' | 'owner-provided-needs-evidence' | 'missing'
export type PermissionState =
  | 'not-required'
  | 'approved'
  | 'anonymized-approved'
  | 'owner-provided-needs-evidence'
  | 'not-requested'
export type ProofPublicationStatus = 'publishable' | 'hidden'

export type ProofInventoryItem = {
  id: string
  kind: ProofInventoryKind
  title: string
  productRefs: ProductId[]
  plannedRoute: string
  releaseMinimumSlot?: 'case-1' | 'case-2' | 'case-3' | 'review-1' | 'review-2' | 'review-3'
  evidenceState: EvidenceState
  evidenceRefs: string[]
  permissionState: PermissionState
  blockers: string[]
  publicationStatus: ProofPublicationStatus
  hiddenReason?: string
}

export function toProofPublicationGateInput(item: ProofInventoryItem): PublicationGateInput {
  return {
    id: item.id,
    entity: 'proof',
    publicationStatus: item.publicationStatus,
    evidenceState: item.evidenceState,
    evidenceRefs: item.evidenceRefs,
    permissionState: item.permissionState,
    blockers: item.blockers,
  }
}

export const proofEvidenceInventory: ProofInventoryItem[] = [
  {
    id: 'tariff-impuls-personal-calculation',
    kind: 'tariff',
    title: 'Импульс — персональный расчёт запуска',
    productRefs: ['impuls'],
    plannedRoute: '/tarify/',
    evidenceState: 'owner-provided-needs-evidence',
    evidenceRefs: ['docs/01_PRD.md#12-business-rules', 'docs/04_BACKLOG.md#OD-02'],
    permissionState: 'not-required',
    blockers: ['OD-02'],
    publicationStatus: 'hidden',
    hiddenReason: 'Тарифы публикуются только после утверждения коммерческих правил владельцем.',
  },
  {
    id: 'tariff-pixel-readiness-check',
    kind: 'tariff',
    title: 'Импульс Пиксель — проверка применимости',
    productRefs: ['pixel'],
    plannedRoute: '/tarify/',
    evidenceState: 'owner-provided-needs-evidence',
    evidenceRefs: ['docs/01_PRD.md#12-business-rules', 'docs/04_BACKLOG.md#OD-02'],
    permissionState: 'not-required',
    blockers: ['OD-02'],
    publicationStatus: 'hidden',
    hiddenReason: 'Нет утверждённой цены, состава и коммерческих ограничений.',
  },
  {
    id: 'tariff-zashchita-audit',
    kind: 'tariff',
    title: 'Импульс Защита — аудит риска перехвата',
    productRefs: ['zashchita'],
    plannedRoute: '/tarify/',
    evidenceState: 'owner-provided-needs-evidence',
    evidenceRefs: ['docs/01_PRD.md#12-business-rules', 'docs/04_BACKLOG.md#OD-02'],
    permissionState: 'not-required',
    blockers: ['OD-02'],
    publicationStatus: 'hidden',
    hiddenReason: 'Аудит нельзя публиковать как тариф без подтверждённых условий.',
  },
  {
    id: 'calculation-impuls-launch-assumptions',
    kind: 'calculation',
    title: 'Расчёт запуска Импульса — входные допущения',
    productRefs: ['impuls'],
    plannedRoute: '/raschety/',
    evidenceState: 'owner-provided-needs-evidence',
    evidenceRefs: ['docs/01_PRD.md#9-scope-первого-публичного-релиза', 'docs/04_BACKLOG.md#OD-02'],
    permissionState: 'not-required',
    blockers: ['OD-02'],
    publicationStatus: 'hidden',
    hiddenReason: 'Расчёты публикуются только после утверждения коммерческих правил и ограничений.',
  },
  {
    id: 'case-release-niche-1-impuls',
    kind: 'case',
    title: 'Кейс 1: подтверждённая ниша для Импульса',
    productRefs: ['impuls'],
    plannedRoute: '/keisy/[slug]/',
    releaseMinimumSlot: 'case-1',
    evidenceState: 'missing',
    evidenceRefs: ['docs/01_PRD.md#2-контекст-бизнеса', 'docs/04_BACKLOG.md#OD-01'],
    permissionState: 'not-requested',
    blockers: ['OD-01', 'case-source', 'case-period', 'case-methodology', 'publication-permission'],
    publicationStatus: 'hidden',
    hiddenReason: 'Ниша, период, методика, метрики и разрешение на публикацию ещё не приложены.',
  },
  {
    id: 'case-release-niche-2-pixel',
    kind: 'case',
    title: 'Кейс 2: подтверждённая ниша для Пикселя',
    productRefs: ['pixel'],
    plannedRoute: '/keisy/[slug]/',
    releaseMinimumSlot: 'case-2',
    evidenceState: 'missing',
    evidenceRefs: ['docs/01_PRD.md#2-контекст-бизнеса', 'docs/04_BACKLOG.md#OD-01'],
    permissionState: 'not-requested',
    blockers: ['OD-01', 'case-source', 'case-period', 'case-methodology', 'publication-permission'],
    publicationStatus: 'hidden',
    hiddenReason: 'Материал не может попасть в кейсы без доказательств и permission state.',
  },
  {
    id: 'case-release-niche-3-zashchita',
    kind: 'case',
    title: 'Кейс 3: подтверждённая ниша для Защиты',
    productRefs: ['zashchita'],
    plannedRoute: '/keisy/[slug]/',
    releaseMinimumSlot: 'case-3',
    evidenceState: 'missing',
    evidenceRefs: ['docs/01_PRD.md#2-контекст-бизнеса', 'docs/04_BACKLOG.md#OD-01'],
    permissionState: 'not-requested',
    blockers: ['OD-01', 'case-source', 'case-period', 'case-methodology', 'publication-permission'],
    publicationStatus: 'hidden',
    hiddenReason: 'Публичная защита-кейс история требует проверяемых симптомов, периода и разрешения.',
  },
  {
    id: 'review-release-1',
    kind: 'review',
    title: 'Отзыв 1: подтверждённый или прозрачно обезличенный',
    productRefs: ['impuls'],
    plannedRoute: '/otzyvy/',
    releaseMinimumSlot: 'review-1',
    evidenceState: 'missing',
    evidenceRefs: ['docs/01_PRD.md#9-scope-первого-публичного-релиза', 'docs/02_PRODUCT_STRUCTURE.md#11-supporting-page-contracts'],
    permissionState: 'not-requested',
    blockers: ['review-source', 'identity-or-anonymization', 'publication-permission'],
    publicationStatus: 'hidden',
    hiddenReason: 'Отзыв не имеет источника, статуса идентификации/обезличивания и разрешения.',
  },
  {
    id: 'review-release-2',
    kind: 'review',
    title: 'Отзыв 2: подтверждённый или прозрачно обезличенный',
    productRefs: ['pixel'],
    plannedRoute: '/otzyvy/',
    releaseMinimumSlot: 'review-2',
    evidenceState: 'missing',
    evidenceRefs: ['docs/01_PRD.md#9-scope-первого-публичного-релиза', 'docs/02_PRODUCT_STRUCTURE.md#11-supporting-page-contracts'],
    permissionState: 'not-requested',
    blockers: ['review-source', 'identity-or-anonymization', 'publication-permission'],
    publicationStatus: 'hidden',
    hiddenReason: 'Отзывы не подменяют кейсы и скрыты до подтверждения permission state.',
  },
  {
    id: 'review-release-3',
    kind: 'review',
    title: 'Отзыв 3: подтверждённый или прозрачно обезличенный',
    productRefs: ['zashchita'],
    plannedRoute: '/otzyvy/',
    releaseMinimumSlot: 'review-3',
    evidenceState: 'missing',
    evidenceRefs: ['docs/01_PRD.md#9-scope-первого-публичного-релиза', 'docs/02_PRODUCT_STRUCTURE.md#11-supporting-page-contracts'],
    permissionState: 'not-requested',
    blockers: ['review-source', 'identity-or-anonymization', 'publication-permission'],
    publicationStatus: 'hidden',
    hiddenReason: 'Публичный отзыв по защите требует аккуратного source/permission статуса.',
  },
]

export function validateProofEvidenceInventory(items: ProofInventoryItem[] = proofEvidenceInventory) {
  const issues: string[] = []
  const ids = new Set<string>()
  issues.push(...validatePublicationGateMatrix(items.map(toProofPublicationGateInput)))

  for (const item of items) {
    if (ids.has(item.id)) {
      issues.push(`${item.id}: duplicate id`)
    }
    ids.add(item.id)

    if (item.productRefs.length === 0) {
      issues.push(`${item.id}: missing product refs`)
    }

    if (item.evidenceRefs.length === 0) {
      issues.push(`${item.id}: missing evidence refs`)
    }

    if (!item.permissionState) {
      issues.push(`${item.id}: missing permission state`)
    }

    if (item.publicationStatus === 'publishable') {
      if (item.evidenceState !== 'verified') {
        issues.push(`${item.id}: publishable item must have verified evidence`)
      }

      if (item.permissionState === 'not-requested' || item.permissionState === 'owner-provided-needs-evidence') {
        issues.push(`${item.id}: publishable item must have approved permission state`)
      }

      if (item.blockers.length > 0) {
        issues.push(`${item.id}: publishable item cannot have blockers`)
      }
    }

    if (item.publicationStatus === 'hidden' && !item.hiddenReason) {
      issues.push(`${item.id}: hidden item must explain why it is hidden`)
    }
  }

  return issues
}

export function getPublicProofEvidence(items: ProofInventoryItem[] = proofEvidenceInventory) {
  return items.filter((item) => isPublicationAllowed(toProofPublicationGateInput(item)))
}
