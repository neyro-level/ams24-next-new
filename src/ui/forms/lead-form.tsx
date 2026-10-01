import { Button } from '@/ui/primitives/button'
import { Checkbox } from '@/ui/primitives/checkbox'
import { Input } from '@/ui/primitives/input'
import { Label } from '@/ui/primitives/label'
import { Textarea } from '@/ui/primitives/textarea'

import { getLeadFormAvailability, type LeadContext } from '@/core/leads'

type LeadFormProps = {
  context: LeadContext
  title?: string
  description?: string
  headingLevel?: 'h2' | 'h3'
  surface?: 'dark' | 'light'
}

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
  headingLevel = 'h2',
  surface = 'dark',
}: LeadFormProps) {
  const availability = getLeadFormAvailability()
  const isDark = surface === 'dark'
  const cardClass = isDark
    ? 'border-surface-dark-faint bg-surface-dark-elevated text-surface-dark-foreground'
    : 'border-border bg-surface-elevated text-foreground'
  const mutedClass = isDark ? 'text-surface-dark-muted' : 'text-muted-foreground'
  const faintClass = isDark ? 'text-surface-dark-faint' : 'text-muted-foreground'
  const contextCopy = productCopy[context.product]
  const Heading = headingLevel

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
        <Heading className="mt-4 font-display text-h3 font-extrabold">{title}</Heading>
        <p className={`mt-3 text-body-sm ${mutedClass}`}>{description}</p>
      </div>

      <input name="product" type="hidden" value={context.product} />
      <input name="route" type="hidden" value={context.route} />
      <input name="ctaId" type="hidden" value={context.ctaId} />

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor={`${availability.formId}-name`} surface={surface}>Имя</Label>
          <Input
            className="mt-2"
            disabled
            id={`${availability.formId}-name`}
            name="name"
            placeholder="Заполним после подключения формы"
            surface={surface}
            type="text"
          />
        </div>
        <div>
          <Label htmlFor={`${availability.formId}-contact`} surface={surface}>Контакт</Label>
          <Input
            className="mt-2"
            disabled
            id={`${availability.formId}-contact`}
            name="contact"
            placeholder="Телефон или email"
            surface={surface}
            type="text"
          />
        </div>
      </div>

      <div className="mt-4">
        <Label htmlFor={`${availability.formId}-task`} surface={surface}>Какая задача сейчас важнее?</Label>
        <Textarea
          className="mt-2"
          disabled
          id={`${availability.formId}-task`}
          name="task"
          placeholder="Привлечение лидов, пиксель или защита"
          surface={surface}
        />
      </div>

      <Label className="mt-4 flex items-start gap-3" htmlFor={`${availability.formId}-consent`} surface={surface}>
        <Checkbox
          className="mt-1"
          disabled
          id={`${availability.formId}-consent`}
          name="consentAccepted"
          surface={surface}
          value="true"
        />
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
      </Label>

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
