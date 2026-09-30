import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import ContactsPage, { metadata as contactsMetadata } from '@/app/kontakty/page'
import PolicyPage, { metadata as policyMetadata } from '@/app/politika/page'
import ConsentPage, { metadata as consentMetadata } from '@/app/soglasie/page'
import DataProcessingPage, { metadata as dataProcessingMetadata } from '@/app/obrabotka-dannyh/page'
import { analyticsProviderStatus, createAnalyticsEvent, trackAnalyticsEvent } from '@/project/analytics'
import {
  buildDisabledLeadRequest,
  buildLeadRequest,
  getLeadFormAvailability,
  leadConsentContract,
  leadConsentTargets,
  leadFormRuntime,
  leadRequestBoundary,
  validateLeadRequestPayload,
  validateLeadDraft,
} from '@/project/lead-contract'

describe('lead form, legal guard and analytics hardening', () => {
  it('keeps contact form static-safe and disabled until API/legal decisions are approved', () => {
    const html = renderToStaticMarkup(<ContactsPage />)
    const availability = getLeadFormAvailability()

    expect(contactsMetadata.robots).toMatchObject({ index: false, follow: true })
    expect(availability.submissionEnabled).toBe(false)
    expect(availability.endpoint).toBe('/api/leads')
    expect(availability.consentTargets).toEqual(leadConsentTargets)
    expect(html).toContain('aria-label="Форма расчёта"')
    expect(html).toContain('action="/api/leads"')
    expect(html).toContain('disabled=""')
    expect(html).toContain('href="/soglasie/"')
    expect(html).toContain('href="/politika/"')
    expect(html).toContain(leadFormRuntime.disabledReason)
  })

  it('renders the canonical form without network calls while submission is disabled', () => {
    const originalFetch = globalThis.fetch
    const calls: unknown[] = []

    globalThis.fetch = ((...args: unknown[]) => {
      calls.push(args)
      return Promise.resolve(new Response(null, { status: 204 }))
    }) as typeof fetch

    try {
      const html = renderToStaticMarkup(<ContactsPage />)

      expect(calls).toHaveLength(0)
      expect(leadFormRuntime.submissionEnabled).toBe(false)
      expect(html).toContain('action="/api/leads"')
      expect(html).toContain('method="post"')
      expect(html).toContain('disabled=""')
      expect(html).toContain('data-analytics-event="lead_form_submit_blocked"')
    } finally {
      globalThis.fetch = originalFetch
    }
  })

  it('validates future lead payloads and keeps idempotency explicit', () => {
    const validLead = {
      name: 'Анна',
      contact: '+7 900 000-00-00',
      task: 'Нужно рассчитать запуск по медицинской нише',
      consentAccepted: true,
      context: {
        product: 'impuls',
        route: '/impuls/',
        ctaId: 'calculate-launch',
      },
      idempotencyKey: '11111111-1111-4111-8111-111111111111',
    } as const

    expect(validateLeadDraft(validLead).success).toBe(true)

    const request = buildDisabledLeadRequest(validLead)
    expect(request).toMatchObject({
      endpoint: '/api/leads',
      method: 'POST',
      idempotencyKey: validLead.idempotencyKey,
    })

    expect(
      validateLeadDraft({
        ...validLead,
        consentAccepted: false,
      }).success,
    ).toBe(false)
  })

  it('defines canonical lead request, consent and idempotency boundaries', () => {
    const payload = {
      name: 'Анна',
      contact: '+7 900 000-00-00',
      task: 'Нужно рассчитать запуск по медицинской нише',
      context: {
        product: 'impuls',
        route: '/impuls/',
        ctaId: 'calculate-launch',
      },
      consent: {
        accepted: true,
        version: leadConsentContract.version,
        acceptedAt: '2026-09-30T12:00:00+03:00',
        targets: leadConsentTargets,
      },
      idempotencyKey: '11111111-1111-4111-8111-111111111111',
    } as const

    expect(validateLeadRequestPayload(payload).success).toBe(true)
    expect(leadRequestBoundary).toMatchObject({
      endpoint: '/api/leads',
      method: 'POST',
      frontendSubmissionEnabled: false,
      authoritativeOwner: 'AMS Leads API',
    })
    expect(buildLeadRequest(payload)).toMatchObject({
      endpoint: '/api/leads',
      method: 'POST',
      idempotencyKey: payload.idempotencyKey,
    })
  })

  it('renders legal pages as noindex placeholders with release blockers', () => {
    const pages = [
      { component: <PolicyPage />, metadata: policyMetadata, title: 'Политика обработки данных' },
      { component: <ConsentPage />, metadata: consentMetadata, title: 'Согласие на обработку данных' },
      { component: <DataProcessingPage />, metadata: dataProcessingMetadata, title: 'Обработка данных' },
    ]

    for (const page of pages) {
      const html = renderToStaticMarkup(page.component)

      expect(page.metadata.robots).toMatchObject({ index: false, follow: true })
      expect(html).toContain(page.title)
      expect(html).toContain('legal-draft-2026-09-29')
      expect(html).toContain('ждёт согласования')
      expect(html).toContain('юридического согласования')
    }
  })

  it('keeps analytics typed, disabled and free of PII payload keys', () => {
    expect(analyticsProviderStatus.provider).toBe('disabled')

    const event = createAnalyticsEvent({
      name: 'lead_form_view',
      product: 'impuls',
      route: '/impuls/',
      formId: 'ams24-lead-form',
    })

    expect(trackAnalyticsEvent(event)).toMatchObject({
      status: 'noop',
      provider: 'disabled',
    })

    expect(() =>
      createAnalyticsEvent({
        name: 'cta_click',
        product: 'impuls',
        route: '/impuls/',
        email: 'person@example.com',
      } as never),
    ).toThrow(/Unrecognized key|PII-like key/)
  })
})
