import { readFileSync } from 'node:fs'
import { describe, expect, it, vi } from 'vitest'

import {
  dispatchLeadFormAnalytics,
  toLeadFormAnalyticsEvent,
} from '@/app/_integrations/lead-form-analytics'

const baseLifecycle = {
  submissionEnabled: true,
  formId: 'ams24-lead-form',
  context: {
    product: 'impuls',
    route: '/impuls/',
    ctaId: 'calculate-launch',
  },
} as const

describe('lead form analytics integration', () => {
  it('maps enabled lifecycle transitions to safe typed events without PII', () => {
    const expectedNames = {
      view: 'lead_form_view',
      'submit-started': 'lead_form_submit_started',
      'submit-succeeded': 'lead_form_submit_succeeded',
      'submit-failed': 'lead_form_submit_failed',
    } as const

    for (const [stage, name] of Object.entries(expectedNames)) {
      expect(toLeadFormAnalyticsEvent({ ...baseLifecycle, stage })).toEqual({
        name,
        product: 'impuls',
        route: '/impuls/',
        ctaId: 'calculate-launch',
        formId: 'ams24-lead-form',
      })
    }
  })

  it('does not dispatch submission analytics while lead submission is disabled', () => {
    const tracker = vi.fn()

    for (const stage of ['submit-started', 'submit-succeeded', 'submit-failed'] as const) {
      expect(dispatchLeadFormAnalytics({ ...baseLifecycle, stage, submissionEnabled: false }, tracker))
        .toEqual({ status: 'ignored-disabled-submission' })
    }

    expect(tracker).not.toHaveBeenCalled()
  })

  it('dispatches each submission transition only when submission is enabled', () => {
    const tracker = vi.fn((event) => event)

    for (const stage of ['submit-started', 'submit-succeeded', 'submit-failed'] as const) {
      dispatchLeadFormAnalytics({ ...baseLifecycle, stage }, tracker)
    }

    expect(tracker).toHaveBeenCalledTimes(3)
    expect(tracker.mock.calls.map(([event]) => event.name)).toEqual([
      'lead_form_submit_started',
      'lead_form_submit_succeeded',
      'lead_form_submit_failed',
    ])
  })

  it('rejects PII or raw form values before analytics dispatch', () => {
    const tracker = vi.fn()

    expect(() => dispatchLeadFormAnalytics({
      ...baseLifecycle,
      stage: 'submit-started',
      contact: '+7 900 000-00-00',
    }, tracker)).toThrow(/Unrecognized key/)
    expect(tracker).not.toHaveBeenCalled()
  })

  it('keeps analytics ownership out of reusable lead form UI', () => {
    const formSource = readFileSync('src/ui/forms/lead-form-client.tsx', 'utf8')
    const bridgeSource = readFileSync('src/app/_integrations/analytics-bridge.tsx', 'utf8')

    expect(formSource).not.toContain('data-analytics-')
    expect(formSource).not.toContain('@/core/analytics')
    expect(bridgeSource).toContain('dispatchLeadFormAnalytics')
  })
})
