export type PublicationGateEntity = 'claim' | 'proof'

export type PublicationGateStatus = 'allowed' | 'needs-review' | 'hidden' | 'publishable'

export type PublicationGateEvidenceState =
  | 'project-verified'
  | 'verified'
  | 'owner-provided-needs-evidence'
  | 'legal-review-required'
  | 'unsupported-hidden'
  | 'missing'

export type PublicationGatePermissionState =
  | 'not-required'
  | 'approved'
  | 'anonymized-approved'
  | 'owner-provided-needs-evidence'
  | 'not-requested'

export type PublicationGateInput = {
  id: string
  entity: PublicationGateEntity
  publicationStatus: PublicationGateStatus
  evidenceState: PublicationGateEvidenceState
  evidenceRefs: readonly string[]
  permissionState?: PublicationGatePermissionState
  blockers?: readonly string[]
}

export type PublicationGateDecision = {
  id: string
  entity: PublicationGateEntity
  allowed: boolean
  reasons: string[]
}

const allowedClaimEvidence = new Set<PublicationGateEvidenceState>(['project-verified'])
const allowedProofEvidence = new Set<PublicationGateEvidenceState>(['verified'])
const allowedProofPermissions = new Set<PublicationGatePermissionState>([
  'not-required',
  'approved',
  'anonymized-approved',
])

export function evaluatePublicationGate(input: PublicationGateInput): PublicationGateDecision {
  const reasons: string[] = []
  const blockers = input.blockers ?? []

  if (input.evidenceRefs.length === 0) {
    reasons.push('missing evidence refs')
  }

  if (input.entity === 'claim') {
    if (input.publicationStatus !== 'allowed') {
      reasons.push(`claim status is ${input.publicationStatus}`)
    }

    if (!allowedClaimEvidence.has(input.evidenceState)) {
      reasons.push(`claim evidence is ${input.evidenceState}`)
    }
  }

  if (input.entity === 'proof') {
    if (input.publicationStatus !== 'publishable') {
      reasons.push(`proof status is ${input.publicationStatus}`)
    }

    if (!allowedProofEvidence.has(input.evidenceState)) {
      reasons.push(`proof evidence is ${input.evidenceState}`)
    }

    if (!input.permissionState || !allowedProofPermissions.has(input.permissionState)) {
      reasons.push(`proof permission is ${input.permissionState ?? 'missing'}`)
    }

    if (blockers.length > 0) {
      reasons.push(`proof blockers: ${blockers.join(', ')}`)
    }
  }

  return {
    id: input.id,
    entity: input.entity,
    allowed: reasons.length === 0,
    reasons,
  }
}

export function isPublicationAllowed(input: PublicationGateInput) {
  return evaluatePublicationGate(input).allowed
}

export function validatePublicationGateMatrix(items: readonly PublicationGateInput[]) {
  const issues: string[] = []

  for (const item of items) {
    const decision = evaluatePublicationGate(item)
    const statusAllowsPublication =
      (item.entity === 'claim' && item.publicationStatus === 'allowed') ||
      (item.entity === 'proof' && item.publicationStatus === 'publishable')

    if (statusAllowsPublication && !decision.allowed) {
      issues.push(`${item.id}: ${decision.reasons.join('; ')}`)
    }
  }

  return issues
}
