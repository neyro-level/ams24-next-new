import { describe, expect, it, vi } from 'vitest'

import { leadConsentContract, leadConsentTargets, type LeadRequestPayload } from '@/core/leads'
import { isLeadFormDisabled, leadFormReducer, sendLeadRequest } from '@/ui/forms/lead-form-client'

const payload: LeadRequestPayload = {
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
}

describe('T5.1 lead form client state machine', () => {
  it('models validation, submitting, server-error and success states', () => {
    const initial = { status: 'default' as const, fieldErrors: {}, message: '' }
    const invalid = leadFormReducer(initial, {
      type: 'VALIDATION_ERROR',
      fieldErrors: { contact: 'Укажите контакт' },
    })
    const submitting = leadFormReducer(invalid, { type: 'SUBMIT' })
    const failed = leadFormReducer(submitting, { type: 'SERVER_ERROR' })
    const succeeded = leadFormReducer(submitting, { type: 'SUCCESS' })

    expect(invalid).toMatchObject({ status: 'validation-error', fieldErrors: { contact: 'Укажите контакт' } })
    expect(submitting).toMatchObject({ status: 'submitting', fieldErrors: {} })
    expect(failed.status).toBe('server-error')
    expect(succeeded.status).toBe('success')
  })

  it('does not call fetch while submission is disabled', async () => {
    const fetcher = vi.fn()

    await expect(sendLeadRequest(false, payload, fetcher)).resolves.toEqual({ status: 'disabled' })
    expect(fetcher).not.toHaveBeenCalled()
  })

  it('posts canonical JSON to the relative gateway with an idempotency header', async () => {
    const fetcher = vi.fn().mockResolvedValue({ ok: true })

    await expect(sendLeadRequest(true, payload, fetcher)).resolves.toEqual({ status: 'success' })
    expect(fetcher).toHaveBeenCalledOnce()
    expect(fetcher).toHaveBeenCalledWith('/api/leads', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'Idempotency-Key': payload.idempotencyKey,
      },
      body: JSON.stringify(payload),
    })
  })

  it('maps a non-success response to the server-error state', async () => {
    const fetcher = vi.fn().mockResolvedValue({ ok: false })

    await expect(sendLeadRequest(true, payload, fetcher)).resolves.toEqual({ status: 'server-error' })
  })
})

describe('T5.2 native fallback guard', () => {
  it('derives disabled accessibility state from runtime availability and submission state', () => {
    expect(isLeadFormDisabled(false, 'default')).toBe(true)
    expect(isLeadFormDisabled(true, 'default')).toBe(false)
    expect(isLeadFormDisabled(true, 'submitting')).toBe(true)
    expect(isLeadFormDisabled(true, 'server-error')).toBe(false)
  })
})
