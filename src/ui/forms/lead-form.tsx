import { Button } from '@/ui/primitives/button'

import { getLeadFormAvailability, type LeadContext } from '@/core/content/services/lead-contract'

type LeadFormProps = {
  context: LeadContext
  title?: string
  description?: string
  surface?: 'dark' | 'light'
}

const inputBase =
  'mt-2 h-12 w-full rounded-lg border px-3 outline-none focus:border-primary focus:ring-3 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-70'

const productCopy = {
  site: 'по общей задаче',
  impuls: 'по запуску Импульса',
  pixel: 'по проверке Пикселя',
  zashchita: 'по аудиту защиты',
} as const

export function LeadForm({
  context,
  title = 'Опишите задачу — подготовим маршрут запуска',
  description = 'Форма показывает будущий состав заявки и цели согласия. Отправка отключена до финального подключения и утверждения юридического текста.',
  surface = 'dark',
}: LeadFormProps) {
  const availability = getLeadFormAvailability()
  const isDark = surface === 'dark'
  const cardClass = isDark
    ? 'border-surface-dark-faint bg-surface-dark-elevated text-surface-dark-foreground'
    : 'border-border bg-surface-elevated text-foreground'
  const inputClass = isDark
    ? `${inputBase} border-surface-dark-faint bg-surface-dark text-surface-dark-foreground`
    : `${inputBase} border-border bg-background text-foreground`
  const mutedClass = isDark ? 'text-surface-dark-muted' : 'text-muted-foreground'
  const faintClass = isDark ? 'text-surface-dark-faint' : 'text-muted-foreground'
  const contextCopy = productCopy[context.product]

  return (
    <form
      action={availability.endpoint}
      aria-describedby={`${availability.formId}-status`}
      aria-label="Форма расчёта"
      className={`rounded-large border p-5 shadow-panel sm:p-7 ${cardClass}`}
      data-analytics-event="lead_form_view"
      data-endpoint={availability.endpoint}
      data-form-id={availability.formId}
      data-product={context.product}
      data-route={context.route}
      method="post"
    >
      <div>
        <p className={`text-label font-bold uppercase ${faintClass}`}>Заявка</p>
        <h2 className="mt-4 font-display text-h3 font-extrabold">{title}</h2>
        <p className={`mt-3 text-body-sm ${mutedClass}`}>{description}</p>
      </div>

      <input name="product" type="hidden" value={context.product} />
      <input name="route" type="hidden" value={context.route} />
      <input name="ctaId" type="hidden" value={context.ctaId} />

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block text-body-sm">
          <span className={mutedClass}>Имя</span>
          <input className={inputClass} disabled name="name" placeholder="Заполним после подключения формы" type="text" />
        </label>
        <label className="block text-body-sm">
          <span className={mutedClass}>Контакт</span>
          <input className={inputClass} disabled name="contact" placeholder="Телефон или email" type="text" />
        </label>
      </div>

      <label className="mt-4 block text-body-sm">
        <span className={mutedClass}>Какая задача сейчас важнее?</span>
        <textarea
          className={`${inputClass} min-h-28 p-3`}
          disabled
          name="task"
          placeholder="Привлечение лидов, пиксель или защита"
        />
      </label>

      <label className={`mt-4 flex gap-3 text-body-sm ${mutedClass}`}>
        <input className="mt-1 size-4" disabled name="consentAccepted" type="checkbox" value="true" />
        <span>
          Я принимаю{' '}
          <a className="underline underline-offset-4" href={availability.consentTargets.consent}>
            согласие
          </a>{' '}
          и{' '}
          <a className="underline underline-offset-4" href={availability.consentTargets.policy}>
            политику обработки данных
          </a>
          .
        </span>
      </label>

      <p className={`mt-4 text-caption ${faintClass}`} id={`${availability.formId}-status`}>
        Отправка отключена: {availability.disabledReason}. Вы можете заранее подготовить задачу {contextCopy}.
      </p>

      <Button
        aria-disabled="true"
        className="mt-6 w-full"
        size="xl"
        data-analytics-event="lead_form_submit_blocked"
        disabled={!availability.submissionEnabled}
        type="submit"
      >
        Получить расчёт
      </Button>
    </form>
  )
}

