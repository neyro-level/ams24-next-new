import { describe, expect, it } from 'vitest'

import {
  analyticsEventSchema,
  analyticsForbiddenPayloadKeys,
  createAnalyticsEvent,
  trackAnalyticsEvent,
} from '@/core/analytics'

const allowedEvents = [
  {
    name: 'cta_click',
    product: 'site',
    route: '/',
    ctaId: 'home-calculation',
  },
  {
    name: 'lead_form_view',
    product: 'impuls',
    route: '/impuls/',
    formId: 'ams24-lead-form',
  },
  {
    name: 'lead_form_submit_started',
    product: 'zashchita',
    route: '/zashchita/',
    formId: 'ams24-lead-form',
  },
  {
    name: 'legal_link_click',
    product: 'pixel',
    route: '/pixel/',
    legalTarget: '/politika/',
  },
] as const

const deniedEvents = [
  {
    reason: 'raw lead full name',
    event: {
      name: 'lead_form_submit_started',
      product: 'site',
      route: '/',
      formId: 'ams24-lead-form',
      fullName: 'Анна',
    },
  },
  {
    reason: 'raw contact',
    event: {
      name: 'lead_form_submit_started',
      product: 'site',
      route: '/',
      formId: 'ams24-lead-form',
      contact: '+7 900 000-00-00',
    },
  },
  {
    reason: 'raw task text',
    event: {
      name: 'lead_form_submit_started',
      product: 'impuls',
      route: '/impuls/',
      formId: 'ams24-lead-form',
      task: 'Нужен запуск по медицинской нише',
    },
  },
  {
    reason: 'consent/idempotency payload',
    event: {
      name: 'lead_form_submit_started',
      product: 'site',
      route: '/',
      formId: 'ams24-lead-form',
      consentAccepted: true,
      idempotencyKey: '11111111-1111-4111-8111-111111111111',
    },
  },
  {
    reason: 'wrapped raw payload',
    event: {
      name: 'lead_form_submit_started',
      product: 'site',
      route: '/',
      formId: 'ams24-lead-form',
      payload: {
        name: 'Анна',
        contact: '+7 900 000-00-00',
      },
    },
  },
] as const

describe('analytics contract', () => {
  it('accepts only safe analytics event fixtures', () => {
    for (const event of allowedEvents) {
      expect(analyticsEventSchema.safeParse(event).success).toBe(true)
      expect(trackAnalyticsEvent(event)).toMatchObject({
        status: 'noop',
        event,
      })
    }
  })

  it('rejects PII and raw lead form values in analytics fixtures', () => {
    for (const fixture of deniedEvents) {
      expect(() => createAnalyticsEvent(fixture.event), fixture.reason).toThrow(
        /Unrecognized key|PII-like key/,
      )
    }
  })

  it('keeps raw lead payload keys outside the analytics schema', () => {
    for (const key of analyticsForbiddenPayloadKeys) {
      expect(
        analyticsEventSchema.safeParse({
          name: 'lead_form_view',
          product: 'site',
          route: '/',
          formId: 'ams24-lead-form',
          [key]: 'forbidden',
        }).success,
      ).toBe(false)
    }
  })
})
