'use client'

import Link from 'next/link'
import { type FormEvent, useCallback, useEffect, useReducer, useState } from 'react'

import {
  buildLeadRequest,
  createLeadFormLifecycleEvent,
  leadConsentContract,
  leadConsentTargets,
  leadFormLifecycleEventName,
  type LeadContext,
  type LeadRequestPayload,
  validateLeadDraft,
} from '@/core/leads'
import { Button } from '@/ui/primitives/button'
import { Checkbox } from '@/ui/primitives/checkbox'
import { Input } from '@/ui/primitives/input'
import { Label } from '@/ui/primitives/label'
import { Textarea } from '@/ui/primitives/textarea'

type LeadFormStatus = 'default' | 'validation-error' | 'submitting' | 'server-error' | 'success'
type FieldName = 'name' | 'contact' | 'task' | 'consentAccepted'
type FieldErrors = Partial<Record<FieldName, string>>

type LeadFormState = {
  status: LeadFormStatus
  fieldErrors: FieldErrors
  message: string
}

type LeadFormAction =
  | { type: 'VALIDATION_ERROR'; fieldErrors: FieldErrors }
  | { type: 'SUBMIT' }
  | { type: 'SERVER_ERROR' }
  | { type: 'SUCCESS' }

const initialState: LeadFormState = { status: 'default', fieldErrors: {}, message: '' }

export function isLeadFormDisabled(submissionEnabled: boolean, status: LeadFormStatus) {
  return !submissionEnabled || status === 'submitting'
}

export function leadFormReducer(state: LeadFormState, action: LeadFormAction): LeadFormState {
  switch (action.type) {
    case 'VALIDATION_ERROR':
      return { status: 'validation-error', fieldErrors: action.fieldErrors, message: 'Проверьте отмеченные поля.' }
    case 'SUBMIT':
      return { status: 'submitting', fieldErrors: {}, message: 'Отправляем заявку…' }
    case 'SERVER_ERROR':
      return { status: 'server-error', fieldErrors: {}, message: 'Не удалось отправить заявку. Попробуйте ещё раз.' }
    case 'SUCCESS':
      return { status: 'success', fieldErrors: {}, message: 'Заявка отправлена. Мы свяжемся с вами.' }
    default:
      return state
  }
}

type LeadFetch = (input: RequestInfo | URL, init?: RequestInit) => Promise<Pick<Response, 'ok'>>

export async function sendLeadRequest(
  submissionEnabled: boolean,
  payload: LeadRequestPayload,
  fetcher: LeadFetch = fetch,
) {
  if (!submissionEnabled) return { status: 'disabled' as const }

  const request = buildLeadRequest(payload)
  const response = await fetcher(request.endpoint, {
    method: request.method,
    headers: request.headers,
    body: JSON.stringify(request.body),
  })

  return { status: response.ok ? ('success' as const) : ('server-error' as const) }
}

type Availability = {
  submissionEnabled: boolean
  disabledReason: string
  consentTargets: typeof leadConsentTargets
  endpoint: string
  formId: string
}

type LeadFormClientProps = {
  availability: Availability
  context: LeadContext
  title: string
  description: string
  headingLevel: 'h2' | 'h3'
  surface: 'dark' | 'light'
}

const productCopy = {
  site: 'по общей задаче',
  impuls: 'по запуску Импульса',
  pixel: 'по проверке Пикселя',
  zashchita: 'по аудиту защиты',
} as const

export function LeadFormClient({ availability, context, description, headingLevel, surface, title }: LeadFormClientProps) {
  const [state, dispatch] = useReducer(leadFormReducer, initialState)
  const [consentAccepted, setConsentAccepted] = useState(false)
  const [startedAt, setStartedAt] = useState(() => Date.now())
  const isDark = surface === 'dark'
  const disabled = isLeadFormDisabled(availability.submissionEnabled, state.status)
  const Heading = headingLevel

  const emitLifecycle = useCallback((stage: 'view' | 'submit-started' | 'submit-succeeded' | 'submit-failed') => {
    window.dispatchEvent(new CustomEvent(leadFormLifecycleEventName, {
      detail: createLeadFormLifecycleEvent({
        stage,
        submissionEnabled: availability.submissionEnabled,
        formId: availability.formId,
        context,
      }),
    }))
  }, [availability.formId, availability.submissionEnabled, context])

  useEffect(() => {
    emitLifecycle('view')
  }, [emitLifecycle])

  const cardClass = isDark
    ? 'border-surface-dark-faint bg-surface-dark-elevated text-surface-dark-foreground'
    : 'border-border bg-surface-elevated text-foreground'
  const mutedClass = isDark ? 'text-surface-dark-muted' : 'text-muted-foreground'
  const faintClass = isDark ? 'text-surface-dark-faint' : 'text-muted-foreground'

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!availability.submissionEnabled) return

    const form = event.currentTarget
    const formData = new FormData(form)
    const idempotencyKey = crypto.randomUUID()
    const draft = validateLeadDraft({
      name: formData.get('name'),
      contact: formData.get('contact'),
      task: formData.get('task'),
      consentAccepted,
      context,
      idempotencyKey,
    })

    if (!draft.success) {
      const flattened = draft.error.flatten().fieldErrors
      dispatch({
        type: 'VALIDATION_ERROR',
        fieldErrors: {
          name: flattened.name ? 'Введите имя: от 2 до 80 символов.' : undefined,
          contact: flattened.contact ? 'Укажите телефон или email.' : undefined,
          task: flattened.task ? 'Опишите задачу: от 10 до 1000 символов.' : undefined,
          consentAccepted: flattened.consentAccepted ? 'Подтвердите согласие на обработку данных.' : undefined,
        },
      })
      return
    }

    const now = Date.now()
    const payload: LeadRequestPayload = {
      name: draft.data.name,
      contact: draft.data.contact,
      task: draft.data.task,
      context,
      consent: {
        accepted: true,
        version: leadConsentContract.version,
        acceptedAt: new Date(now).toISOString(),
        targets: leadConsentTargets,
      },
      antiSpam: {
        honeypot: String(formData.get('companyWebsite') ?? ''),
        startedAt: new Date(startedAt).toISOString(),
        elapsedMs: Math.max(0, now - startedAt),
      },
      idempotencyKey,
    }

    dispatch({ type: 'SUBMIT' })
    emitLifecycle('submit-started')
    try {
      const result = await sendLeadRequest(availability.submissionEnabled, payload)
      dispatch({ type: result.status === 'success' ? 'SUCCESS' : 'SERVER_ERROR' })
      if (result.status === 'success') {
        emitLifecycle('submit-succeeded')
        form.reset()
        setConsentAccepted(false)
        setStartedAt(Date.now())
      } else emitLifecycle('submit-failed')
    } catch {
      dispatch({ type: 'SERVER_ERROR' })
      emitLifecycle('submit-failed')
    }
  }

  const fieldProps = (field: FieldName) => ({
    'aria-describedby': state.fieldErrors[field] ? `${availability.formId}-${field}-error` : undefined,
    'aria-invalid': Boolean(state.fieldErrors[field]),
  })

  return (
    <form
      aria-describedby={`${availability.formId}-status`}
      aria-label="Форма расчёта"
      className={`rounded-large border p-5 shadow-panel sm:p-7 ${cardClass}`}
      data-endpoint={availability.endpoint}
      data-form-id={availability.formId}
      data-product={context.product}
      data-route={context.route}
      noValidate
      onSubmit={handleSubmit}
    >
      <div>
        <p className={`text-label font-bold uppercase ${faintClass}`}>Заявка</p>
        <Heading className="mt-4 font-display text-h3 font-extrabold">{title}</Heading>
        <p className={`mt-3 text-body-sm ${mutedClass}`}>{description}</p>
      </div>

      <input name="product" type="hidden" value={context.product} />
      <input name="route" type="hidden" value={context.route} />
      <input name="ctaId" type="hidden" value={context.ctaId} />

      <div aria-hidden="true" className="sr-only">
        <label htmlFor={`${availability.formId}-companyWebsite`}>Сайт компании</label>
        <input autoComplete="off" disabled={disabled} id={`${availability.formId}-companyWebsite`} name="companyWebsite" tabIndex={-1} type="text" />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor={`${availability.formId}-name`} surface={surface}>Имя</Label>
          <Input className="mt-2" disabled={disabled} id={`${availability.formId}-name`} name="name" surface={surface} type="text" {...fieldProps('name')} />
          {state.fieldErrors.name ? <p className="mt-2 text-caption text-destructive" id={`${availability.formId}-name-error`}>{state.fieldErrors.name}</p> : null}
        </div>
        <div>
          <Label htmlFor={`${availability.formId}-contact`} surface={surface}>Контакт</Label>
          <Input className="mt-2" disabled={disabled} id={`${availability.formId}-contact`} name="contact" surface={surface} type="text" {...fieldProps('contact')} />
          {state.fieldErrors.contact ? <p className="mt-2 text-caption text-destructive" id={`${availability.formId}-contact-error`}>{state.fieldErrors.contact}</p> : null}
        </div>
      </div>

      <div className="mt-4">
        <Label htmlFor={`${availability.formId}-task`} surface={surface}>Какая задача сейчас важнее?</Label>
        <Textarea className="mt-2" disabled={disabled} id={`${availability.formId}-task`} name="task" surface={surface} {...fieldProps('task')} />
        {state.fieldErrors.task ? <p className="mt-2 text-caption text-destructive" id={`${availability.formId}-task-error`}>{state.fieldErrors.task}</p> : null}
      </div>

      <Label className="mt-4 flex items-start gap-3" htmlFor={`${availability.formId}-consent`} surface={surface}>
        <Checkbox
          checked={consentAccepted}
          className="mt-1"
          disabled={disabled}
          id={`${availability.formId}-consent`}
          onCheckedChange={(checked) => setConsentAccepted(checked === true)}
          surface={surface}
          {...fieldProps('consentAccepted')}
        />
        <span>
          Я принимаю <Link className="underline underline-offset-4" href={availability.consentTargets.consent}>согласие</Link>{' '}
          и <Link className="underline underline-offset-4" href={availability.consentTargets.policy}>политику обработки данных</Link>.
        </span>
      </Label>
      {state.fieldErrors.consentAccepted ? <p className="mt-2 text-caption text-destructive" id={`${availability.formId}-consentAccepted-error`}>{state.fieldErrors.consentAccepted}</p> : null}

      <p
        aria-live={state.status === 'server-error' ? 'assertive' : 'polite'}
        className={`mt-4 text-caption ${state.status === 'server-error' ? 'text-destructive' : faintClass}`}
        id={`${availability.formId}-status`}
        role={state.status === 'server-error' ? 'alert' : 'status'}
      >
        {availability.submissionEnabled
          ? state.message || `Подготовьте задачу ${productCopy[context.product]}.`
          : `Отправка отключена: ${availability.disabledReason}. Вы можете заранее подготовить задачу ${productCopy[context.product]}.`}
      </p>

      <Button
        aria-disabled={disabled}
        className="mt-6 w-full"
        disabled={disabled}
        size="xl"
        type="submit"
      >
        {state.status === 'submitting' ? 'Отправляем…' : state.status === 'success' ? 'Заявка отправлена' : 'Получить расчёт'}
      </Button>
    </form>
  )
}
