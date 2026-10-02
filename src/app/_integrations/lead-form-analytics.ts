import { createAnalyticsEvent, trackAnalyticsEvent, type AnalyticsEvent } from '@/core/analytics'
import { createLeadFormLifecycleEvent } from '@/core/leads'

const eventNameByStage = {
  view: 'lead_form_view',
  'submit-started': 'lead_form_submit_started',
  'submit-succeeded': 'lead_form_submit_succeeded',
  'submit-failed': 'lead_form_submit_failed',
} as const

type AnalyticsTracker = (event: AnalyticsEvent) => unknown

export function toLeadFormAnalyticsEvent(input: unknown): AnalyticsEvent | null {
  const lifecycle = createLeadFormLifecycleEvent(input)

  if (lifecycle.stage !== 'view' && !lifecycle.submissionEnabled) return null

  return createAnalyticsEvent({
    name: eventNameByStage[lifecycle.stage],
    product: lifecycle.context.product,
    route: lifecycle.context.route,
    ctaId: lifecycle.context.ctaId,
    formId: lifecycle.formId,
  })
}

export function dispatchLeadFormAnalytics(
  input: unknown,
  tracker: AnalyticsTracker = trackAnalyticsEvent,
) {
  const event = toLeadFormAnalyticsEvent(input)
  if (!event) return { status: 'ignored-disabled-submission' } as const

  return tracker(event)
}
