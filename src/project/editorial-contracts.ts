import type { ProductId, RichTextDTO } from '@/core/content/schemas'
import type { NavigationLink } from '@/project/navigation'

export type KnowledgeEditorialContract = {
  kind: 'knowledge'
  h1: string
  slug: string
  product: ProductId
  task: string
  expectedOutcome: string
  prerequisites: string[]
  steps: Array<{
    title: string
    result: string
  }>
  nextAction: NavigationLink
  related: NavigationLink[]
  body: RichTextDTO
}

export const representativeKnowledgeContract: KnowledgeEditorialContract = {
  kind: 'knowledge',
  h1: 'Как подготовить данные для расчёта',
  slug: 'kak-podgotovit-raschet',
  product: 'impuls',
  task: 'подготовить вводные для первичного расчёта запуска',
  expectedOutcome: 'пользователь понимает, какие данные собрать до обращения',
  prerequisites: ['выбран продукт или есть гипотеза продукта', 'понятна ниша и регион запуска'],
  steps: [
    {
      title: 'Зафиксируйте цель',
      result: 'понятно, нужен запуск привлечения, пиксель или защита',
    },
    {
      title: 'Соберите ограничения',
      result: 'понятны регион, ниша, сроки и желаемый формат передачи лидов',
    },
    {
      title: 'Передайте вводные',
      result: 'можно подготовить предварительный маршрут расчёта',
    },
  ],
  nextAction: { label: 'Получить расчёт', path: '/#lead-form' },
  related: [
    { label: 'Тарифы', path: '/tarify/' },
    { label: 'Контакты', path: '/kontakty/' },
  ],
  body: {
    format: 'markdown',
    value: `
## Шаг 1

Опишите нишу, регион и цель запуска без персональных данных.

## Шаг 2

Соберите ограничения: сроки, формат передачи результата и готовность отдела продаж.

## Следующий шаг

Передайте вводные через [форму расчёта](/#lead-form).
`,
  },
}
