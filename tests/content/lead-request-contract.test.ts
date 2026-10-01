import { describe, expect, it } from 'vitest'

import {
  buildLeadRequest,
  leadConsentContract,
  leadConsentTargets,
  leadRequestBoundary,
  validateLeadRequestPayload,
} from '@/core/leads'

const validPayload = {
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
  antiSpam: {
    honeypot: '',
    startedAt: '2026-09-30T11:59:55+03:00',
    elapsedMs: 5000,
  },
  idempotencyKey: '11111111-1111-4111-8111-111111111111',
} as const

describe('CR-13.1 canonical lead request contract', () => {
  it('builds a canonical disabled-safe request boundary for AMS Leads API', () => {
    const request = buildLeadRequest(validPayload)

    expect(leadRequestBoundary.frontendSubmissionEnabled).toBe(false)
    expect(request.endpoint).toBe('/api/leads')
    expect(request.method).toBe('POST')
    expect(request.headers).toMatchObject({
      'content-type': 'application/json',
      'Idempotency-Key': validPayload.idempotencyKey,
    })
    expect(request.body.consent).toEqual(validPayload.consent)
    expect(request.body.antiSpam).toEqual(validPayload.antiSpam)
  })

  it('requires consent version, accepted timestamp and legal targets', () => {
    expect(validateLeadRequestPayload(validPayload).success).toBe(true)

    expect(
      validateLeadRequestPayload({
        ...validPayload,
        consent: {
          ...validPayload.consent,
          accepted: false,
        },
      }).success,
    ).toBe(false)

    expect(
      validateLeadRequestPayload({
        ...validPayload,
        consent: {
          ...validPayload.consent,
          version: 'stale-consent',
        },
      }).success,
    ).toBe(false)

    expect(
      validateLeadRequestPayload({
        ...validPayload,
        consent: {
          ...validPayload.consent,
          acceptedAt: 'not-a-date',
        },
      }).success,
    ).toBe(false)
  })

  it('rejects invalid context, extra fields and missing idempotency', () => {
    expect(
      validateLeadRequestPayload({
        ...validPayload,
        context: {
          ...validPayload.context,
          route: 'impuls',
        },
      }).success,
    ).toBe(false)

    expect(
      validateLeadRequestPayload({
        ...validPayload,
        idempotencyKey: 'not-a-uuid',
      }).success,
    ).toBe(false)

    expect(
      validateLeadRequestPayload({
        ...validPayload,
        analyticsPayload: {
          contact: validPayload.contact,
        },
      }).success,
    ).toBe(false)
  })

  it('requires a structurally valid anti-spam signal without claiming server enforcement', () => {
    expect(
      validateLeadRequestPayload({
        ...validPayload,
        antiSpam: {
          ...validPayload.antiSpam,
          elapsedMs: -1,
        },
      }).success,
    ).toBe(false)

    expect(
      validateLeadRequestPayload({
        ...validPayload,
        antiSpam: {
          ...validPayload.antiSpam,
          startedAt: 'not-a-date',
        },
      }).success,
    ).toBe(false)
  })
})
