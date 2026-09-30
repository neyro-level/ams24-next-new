import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import ContactsPage, { metadata as contactsMetadata } from '@/app/kontakty/page'
import PolicyPage, { metadata as policyMetadata } from '@/app/politika/page'
import ConsentPage, { metadata as consentMetadata } from '@/app/soglasie/page'
import DataProcessingPage, { metadata as dataProcessingMetadata } from '@/app/obrabotka-dannyh/page'
import { analyticsProviderStatus, createAnalyticsEvent, trackAnalyticsEvent } from '@/project/analytics'
import {
  buildLeadTestRequest,
  getLeadFormAvailability,
  leadConsentTargets,
  leadFormRuntime,
  validateLeadDraft,
} from '@/project/lead-contract'

describe('lead form, legal guard and analytics hardening', () => {
  it('keeps contact form static-safe and disabled until API/legal decisions are approved', () => {
    const html = renderToStaticMarkup(<ContactsPage />)
    const availability = getLeadFormAvailability()

    expect(contactsMetadata.robots).toMatchObject({ index: false, follow: true })
    expect(availability.submissionEnabled).toBe(false)
    expect(availability.endpoint).toBe('/api/leads/test')
    expect(availability.consentTargets).toEqual(leadConsentTargets)
    expect(html).toContain('aria-label="Форма расчёта"')
    expect(html).toContain('action="/api/leads/test"')
    expect(html).toContain('disabled=""')
    expect(html).toContain('href="/soglasie/"')
    expect(html).toContain('href="/politika/"')
    expect(html).toContain(leadFormRuntime.disabledReason)
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

    const request = buildLeadTestRequest(validLead)
    expect(request).toMatchObject({
      endpoint: '/api/leads/test',
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
