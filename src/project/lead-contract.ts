import { z } from 'zod'

const productSchema = z.enum(['site', 'impuls', 'pixel', 'zashchita'])

export const leadConsentTargets = {
  policy: '/politika/',
  consent: '/soglasie/',
  dataProcessing: '/obrabotka-dannyh/',
} as const

export const leadFormRuntime = {
  formId: 'ams24-lead-form',
  endpoint: '/api/leads/test',
  submissionEnabled: false,
  disabledReason:
    'Live submit is disabled until OD-08 API endpoint/schema and OD-03 legal text are approved',
  releaseBlocker: 'public release requires approved lead endpoint, consent text and anti-spam strategy',
} as const

export const leadContextSchema = z.object({
  product: productSchema,
  route: z.string().regex(/^\/(?:[a-z0-9-]+\/)*$/),
  ctaId: z.string().regex(/^[a-z0-9-]+$/),
})

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

export type LeadContext = z.infer<typeof leadContextSchema>
export type LeadDraft = z.infer<typeof leadDraftSchema>

export function validateLeadDraft(input: unknown) {
  return leadDraftSchema.safeParse(input)
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

export function getLeadFormAvailability() {
  return {
    submissionEnabled: leadFormRuntime.submissionEnabled,
    disabledReason: leadFormRuntime.disabledReason,
    consentTargets: leadConsentTargets,
    endpoint: leadFormRuntime.endpoint,
    formId: leadFormRuntime.formId,
  } as const
}
