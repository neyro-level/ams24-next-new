import { z } from 'zod'

const productSchema = z.enum(['site', 'impuls', 'pixel', 'zashchita'])
const isoDateTimeSchema = z.string().datetime({ offset: true })

export const leadConsentTargets = {
  policy: '/politika/',
  consent: '/soglasie/',
  dataProcessing: '/obrabotka-dannyh/',
} as const

export const leadConsentContract = {
  version: 'consent-draft-2026-09',
  requiredTargets: leadConsentTargets,
  releaseBlocker: 'approved legal text is required before live lead submission',
} as const

export const leadRequestBoundary = {
  endpoint: '/api/leads',
  method: 'POST',
  contentType: 'application/json',
  idempotencyHeader: 'Idempotency-Key',
  authoritativeOwner: 'AMS Leads API',
  frontendSubmissionEnabled: false,
} as const

export const leadFormRuntime = {
  formId: 'ams24-lead-form',
  endpoint: '/api/leads/test',
  submissionEnabled: false,
  disabledReason:
    'форма ждёт финального подключения, юридического текста и антиспам-защиты',
  releaseBlocker: 'public release requires approved lead endpoint, consent text and anti-spam strategy',
} as const

export const leadContextSchema = z.object({
  product: productSchema,
  route: z.string().regex(/^\/(?:[a-z0-9-]+\/)*$/),
  ctaId: z.string().regex(/^[a-z0-9-]+$/),
})

export const leadConsentSchema = z
  .object({
    accepted: z.literal(true),
    version: z.literal(leadConsentContract.version),
    acceptedAt: isoDateTimeSchema,
    targets: z.object({
      policy: z.literal(leadConsentTargets.policy),
      consent: z.literal(leadConsentTargets.consent),
      dataProcessing: z.literal(leadConsentTargets.dataProcessing),
    }),
  })
  .strict()

export const leadDraftSchema = z
  .object({
    name: z.string().trim().min(2).max(80),
    contact: z.string().trim().min(5).max(120),
    task: z.string().trim().min(10).max(1000),
    consentAccepted: z.literal(true),
    context: leadContextSchema,
    idempotencyKey: z.string().uuid(),
  })
  .strict()

export const leadRequestPayloadSchema = z
  .object({
    name: z.string().trim().min(2).max(80),
    contact: z.string().trim().min(5).max(120),
    task: z.string().trim().min(10).max(1000),
    context: leadContextSchema,
    consent: leadConsentSchema,
    idempotencyKey: z.string().uuid(),
  })
  .strict()

export type LeadContext = z.infer<typeof leadContextSchema>
export type LeadConsent = z.infer<typeof leadConsentSchema>
export type LeadDraft = z.infer<typeof leadDraftSchema>
export type LeadRequestPayload = z.infer<typeof leadRequestPayloadSchema>

export function validateLeadDraft(input: unknown) {
  return leadDraftSchema.safeParse(input)
}

export function validateLeadRequestPayload(input: unknown) {
  return leadRequestPayloadSchema.safeParse(input)
}

export function buildLeadTestRequest(input: LeadDraft) {
  const lead = leadDraftSchema.parse(input)

  return {
    endpoint: leadFormRuntime.endpoint,
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: lead,
    idempotencyKey: lead.idempotencyKey,
  } as const
}

export function buildLeadRequest(input: LeadRequestPayload) {
  const lead = leadRequestPayloadSchema.parse(input)

  return {
    endpoint: leadRequestBoundary.endpoint,
    method: leadRequestBoundary.method,
    headers: {
      'content-type': leadRequestBoundary.contentType,
      [leadRequestBoundary.idempotencyHeader]: lead.idempotencyKey,
    },
    body: lead,
    idempotencyKey: lead.idempotencyKey,
  } as const
}

export function getLeadFormAvailability() {
  return {
    submissionEnabled: leadFormRuntime.submissionEnabled,
    disabledReason: leadFormRuntime.disabledReason,
    consentTargets: leadConsentTargets,
    endpoint: leadFormRuntime.endpoint,
    formId: leadFormRuntime.formId,
  } as const
}
