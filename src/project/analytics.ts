import { z } from 'zod'

export const analyticsForbiddenPayloadKeys = [
  'acceptedAt',
  'consent',
  'consentAccepted',
  'phone',
  'email',
  'contact',
  'formData',
  'fullName',
  'idempotencyKey',
  'lead',
  'message',
  'payload',
  'task',
  'text',
  'comment',
  'utm_term',
  'query',
] as const

export const analyticsEventNameSchema = z.enum([
  'cta_click',
  'lead_form_view',
  'lead_form_submit_blocked',
  'legal_link_click',
])

export const analyticsProductSchema = z.enum(['site', 'impuls', 'pixel', 'zashchita'])

export const analyticsEventSchema = z
  .object({
    name: analyticsEventNameSchema,
    product: analyticsProductSchema,
    route: z.string().regex(/^\/(?:[a-z0-9-]+\/)*$/),
    ctaId: z.string().regex(/^[a-z0-9-]+$/).optional(),
    formId: z.string().regex(/^[a-z0-9-]+$/).optional(),
    legalTarget: z.enum(['/politika/', '/soglasie/', '/obrabotka-dannyh/']).optional(),
  })
  .strict()
  .superRefine((event, context) => {
    for (const key of analyticsForbiddenPayloadKeys) {
      if (key in event) {
        context.addIssue({
          code: 'custom',
          message: `Analytics event must not include PII-like key "${key}"`,
          path: [key],
        })
      }
    }
  })

export type AnalyticsEvent = z.infer<typeof analyticsEventSchema>

export const analyticsProviderStatus = {
  provider: 'disabled',
  reason: 'Yandex Metrica/account/config is not approved yet',
  releaseBlocker: 'approved analytics scope is required before public release',
} as const

export function createAnalyticsEvent(input: unknown): AnalyticsEvent {
  return analyticsEventSchema.parse(input)
}

export function trackAnalyticsEvent(input: unknown) {
  const event = createAnalyticsEvent(input)

  return {
    status: 'noop',
    provider: analyticsProviderStatus.provider,
    event,
  } as const
}
