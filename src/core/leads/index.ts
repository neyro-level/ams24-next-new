import { z } from 'zod'

import { productIdSchema } from '@/core/content/schemas'

const leadProductContextSchema = z.union([z.literal('site'), productIdSchema])
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
  endpoint: leadRequestBoundary.endpoint,
  submissionEnabled: false,
  disabledReason:
    'форма ждёт финального подключения, юридического текста и антиспам-защиты',
  releaseBlocker: 'public release requires approved lead endpoint, consent text and anti-spam strategy',
} as const

export const leadContextSchema = z.object({
  product: leadProductContextSchema,
  route: z.string().regex(/^\/(?:[a-z0-9-]+\/)*$/),
  ctaId: z.string().regex(/^[a-z0-9-]+$/),
})

export const leadFormLifecycleEventName = 'ams24:lead-form-lifecycle'

export const leadFormLifecycleEventSchema = z
  .object({
    stage: z.enum(['view', 'submit-started', 'submit-succeeded', 'submit-failed']),
    submissionEnabled: z.boolean(),
    formId: z.string().regex(/^[a-z0-9-]+$/),
    context: leadContextSchema,
  })
  .strict()

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

export const leadAntiSpamSignalSchema = z
  .object({
    honeypot: z.string().max(200),
    startedAt: isoDateTimeSchema,
    elapsedMs: z.number().int().nonnegative(),
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
    antiSpam: leadAntiSpamSignalSchema,
    idempotencyKey: z.string().uuid(),
  })
  .strict()

export type LeadContext = z.infer<typeof leadContextSchema>
export type LeadFormLifecycleEvent = z.infer<typeof leadFormLifecycleEventSchema>
export type LeadConsent = z.infer<typeof leadConsentSchema>
export type LeadAntiSpamSignal = z.infer<typeof leadAntiSpamSignalSchema>
export type LeadDraft = z.infer<typeof leadDraftSchema>
export type LeadRequestPayload = z.infer<typeof leadRequestPayloadSchema>

export function validateLeadDraft(input: unknown) {
  return leadDraftSchema.safeParse(input)
}

export function validateLeadRequestPayload(input: unknown) {
  return leadRequestPayloadSchema.safeParse(input)
}

export function createLeadFormLifecycleEvent(input: unknown): LeadFormLifecycleEvent {
  return leadFormLifecycleEventSchema.parse(input)
}

export function buildDisabledLeadRequest(input: LeadDraft) {
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
