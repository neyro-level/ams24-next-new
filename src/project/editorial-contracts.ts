import type { NavigationLink } from '@/project/navigation'
import type { RichTextDTO } from '@/core/content/schemas'
import { buildNoindexMetadata } from '@/core/seo'

type SourceLedgerItem = {
  url: string
  title: string
  checkedAt: 'not checked' | string
  status: 'not checked' | 'verified' | 'partial' | 'rejected'
}

export type ArticleEditorialContract = {
  kind: 'article'
  h1: string
  slug: string
  topic: string
  jtbd: string
  primaryIntent: string
  buyerStage: 'problem-aware' | 'solution-aware' | 'decision'
  targetCommercialPage: NavigationLink
  primaryQuery: 'not checked' | string
  sourceLedger: SourceLedgerItem[]
  outline: Array<{
    heading: string
    readerQuestion: string
    sectionJob: string
    evidence: 'project' | 'external' | 'not checked'
  }>
  cta: NavigationLink
  related: NavigationLink[]
  body: RichTextDTO
}

export type KnowledgeEditorialContract = {
  kind: 'knowledge'
  h1: string
  slug: string
  product: 'impuls' | 'pixel' | 'zashchita'
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

export const representativeArticleContract: ArticleEditorialContract = {
  kind: 'article',
  h1: 'Как выбрать продукт Импульс',
  slug: 'kak-vybrat-produkt',
  topic: 'выбор продукта в линейке Импульс',
  jtbd: 'понять, какой продукт подходит под текущую задачу бизнеса',
  primaryIntent: 'editorial comparison without replacing product landing pages',
  buyerStage: 'solution-aware',
  targetCommercialPage: { label: 'Импульс', path: '/impuls/' },
  primaryQuery: 'not checked',
  sourceLedger: [
    {
      url: 'project://docs/02_PRODUCT_STRUCTURE.md',
      title: 'Product Structure — Supporting Page Contracts',
      checkedAt: 'not checked',
      status: 'not checked',
    },
  ],
  outline: [
    {
      heading: 'Короткий ответ',
      readerQuestion: 'Какой продукт нужен прямо сейчас?',
      sectionJob: 'дать прямой выбор между Импульс, Пиксель и Защита',
      evidence: 'project',
    },
    {
      heading: 'Критерии выбора',
      readerQuestion: 'Какие входные данные влияют на маршрут?',
      sectionJob: 'развести задачи привлечения, определения и защиты',
      evidence: 'not checked',
    },
    {
      heading: 'Следующий шаг',
      readerQuestion: 'Куда перейти после чтения?',
      sectionJob: 'вести к одному коммерческому действию',
      evidence: 'project',
    },
  ],
  cta: { label: 'Получить расчёт', path: '/#lead-form' },
  related: [
    { label: 'Импульс Пиксель', path: '/pixel/' },
    { label: 'Импульс Защита', path: '/zashchita/' },
  ],
  body: {
    kind: 'markdown',
    value: `
## Короткий ответ

Импульс подходит, когда бизнесу нужен новый поток обращений и уже понятны ниша, регион и сценарий обработки результата.

## Как выбрать маршрут

- если нужен запуск привлечения — начните с Импульса;
- если есть свой сайт и трафик — проверьте Пиксель;
- если есть признаки риска утечки лидов — начните с Защиты.

Следующий шаг — перейти на [страницу продукта](/impuls/) и запросить расчёт.
`,
  },
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
    kind: 'markdown',
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

export function buildArticleEditorialMetadata(contract: ArticleEditorialContract) {
  return buildNoindexMetadata({
    title: `${contract.h1} — статья`,
    description: contract.jtbd,
    canonicalPath: `/stati/${contract.slug}/`,
  }, { type: 'article' })
}

export function buildKnowledgeEditorialMetadata(contract: KnowledgeEditorialContract) {
  return buildNoindexMetadata({
    title: `${contract.h1} — база знаний`,
    description: contract.expectedOutcome,
    canonicalPath: `/baza-znaniy/${contract.product}/${contract.slug}/`,
  }, { type: 'article' })
}
