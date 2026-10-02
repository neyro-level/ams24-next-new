import { getLeadFormAvailability, type LeadContext } from '@/core/leads'

import { LeadFormClient } from './lead-form-client'

type LeadFormProps = {
  context: LeadContext
  title?: string
  description?: string
  headingLevel?: 'h2' | 'h3'
  surface?: 'dark' | 'light'
}

export function LeadForm({
  context,
  title = 'Опишите задачу — подготовим маршрут запуска',
  description = 'Форма показывает состав заявки и цели согласия. Отправка отключена до финального подключения и утверждения юридического текста.',
  headingLevel = 'h2',
  surface = 'dark',
}: LeadFormProps) {
  const availability = getLeadFormAvailability()
  return (
    <LeadFormClient
      availability={availability}
      context={context}
      description={description}
      headingLevel={headingLevel}
      surface={surface}
      title={title}
    />
  )
}
