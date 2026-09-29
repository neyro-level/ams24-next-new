import type { Metadata } from 'next'

import { getContentRepository } from '@/core/content/services/repository'
import { getClaimsForProduct } from '@/project/product-claims'
import { Button } from '@/ui/primitives/button'
import { Container } from '@/ui/shared/container'
import { Section, SectionHeader } from '@/ui/shared/section'

export const metadata: Metadata = {
  title: 'Импульс — лидогенерация для бизнеса через целевые аудитории',
  description:
    'Продукт Импульс помогает оценить запуск лидогенерации: применимость, входные данные, процесс, ограничения и расчёт запуска.',
  alternates: {
    canonical: '/impuls/',
  },
  robots: {
    index: true,
    follow: true,
  },
}

const criteria = [
  'понятна ниша и география запуска',
  'есть коммерческое предложение и сценарий обработки обращений',
  'можно честно описать ограничения, сроки и формат передачи результата',
] as const

const launchSteps = [
  {
    title: 'Разбор задачи',
    text: 'Фиксируем продукт, нишу, регион, ограничения и желаемый формат результата.',
  },
  {
    title: 'Проверка применимости',
    text: 'Отделяем подтверждённые вводные от гипотез и отмечаем формулировки, которые требуют legal review.',
  },
  {
    title: 'Расчёт запуска',
    text: 'Готовим понятный маршрут: что считаем, какие данные нужны и какой следующий шаг безопасен.',
  },
] as const

const faqs = [
  {
    question: 'Можно ли обещать точное количество лидов?',
    answer:
      'Нет. До расчёта и подтверждённых входных данных страница не обещает фиксированный объём, стоимость контакта или рост продаж.',
  },
  {
    question: 'Почему нет точной цены на этой странице?',
    answer:
      'Коммерческие правила и тарифы проходят отдельное подтверждение. До OD-02 страница ведёт к персональному расчёту, а не публикует ложную точность.',
  },
  {
    question: 'Что с юридическими формулировками?',
    answer:
      'Чувствительные формулировки про данные, согласия и операторские аудитории отмечены в claim register и проходят маршрут legal-review:OD-03.',
  },
] as const

export default function ImpulsProductPage() {
  const repository = getContentRepository()
  const product = repository.assertProductRef('impuls')
  const allowedClaims = getClaimsForProduct('impuls').filter((claim) => claim.publicationStatus === 'allowed')
  const reviewClaims = getClaimsForProduct('impuls').filter((claim) => claim.publicationStatus === 'needs-review')

  return (
    <main>
      <Section spacing="hero" className="bg-surface-dark text-surface-dark-foreground">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(22rem,0.75fr)] lg:items-end">
            <div>
              <p className="mb-5 text-label font-bold uppercase text-surface-dark-faint">Продукт · AMS24</p>
              <h1 className="max-w-4xl font-display text-display font-extrabold text-surface-dark-foreground">
                Импульс — лидогенерация для бизнеса
              </h1>
              <p className="mt-7 max-w-3xl text-body-lg text-surface-dark-muted">
                Коммерческая страница главного продукта: помогает понять, когда запуск привлечения
                лидов применим, какие вводные нужны для расчёта и какие обещания нельзя давать без
                доказательств.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="h-12 px-5">
                  <a href="#calculation">Рассчитать запуск</a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 border-surface-dark-faint bg-transparent px-5 text-surface-dark-foreground hover:bg-surface-dark-hover hover:text-surface-dark-foreground"
                >
                  <a href="#limits">Посмотреть ограничения</a>
                </Button>
              </div>
            </div>

            <aside
              aria-label="Краткая карточка продукта Импульс"
              className="rounded-large border border-surface-dark-faint bg-surface-dark-elevated p-5 shadow-panel"
            >
              <p className="text-label font-bold uppercase text-surface-dark-faint">Главный сценарий</p>
              <h2 className="mt-5 font-display text-h3 font-bold">{product.name}</h2>
              <p className="mt-4 text-body-sm text-surface-dark-muted">{product.promise}</p>
              <dl className="mt-6 space-y-4 text-body-sm">
                <div>
                  <dt className="text-surface-dark-faint">Primary intent</dt>
                  <dd className="mt-1">получить лиды через целевые аудитории</dd>
                </div>
                <div>
                  <dt className="text-surface-dark-faint">CTA</dt>
                  <dd className="mt-1">{product.primaryCta.label}</dd>
                </div>
              </dl>
            </aside>
          </div>
        </Container>
      </Section>

      <Section className="bg-background">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <SectionHeader
              eyebrow="Задача"
              title="Когда бизнесу нужен именно Импульс"
              lead="Страница не повторяет главную: она отвечает на коммерческий вопрос о запуске привлечения, применимости и следующем шаге."
            />
            <div className="grid gap-4 sm:grid-cols-3">
              {criteria.map((item) => (
                <div className="rounded-card border border-border bg-surface-elevated p-5 shadow-card" key={item}>
                  <p className="text-label font-bold uppercase text-primary">Критерий</p>
                  <p className="mt-4 text-body text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section className="bg-surface-muted">
        <Container>
          <SectionHeader
            eyebrow="Механика без лишнего шума"
            title="Сначала проверяем вводные, затем считаем запуск"
            lead="До юридического подтверждения не публикуем спорные формулировки про данные и операторские аудитории. В публичной логике остаётся проверяемый процесс: задача, применимость, расчёт, передача результата."
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {launchSteps.map((step, index) => (
              <article className="rounded-card border border-border bg-surface-elevated p-6 shadow-card" key={step.title}>
                <p className="text-label font-bold uppercase text-primary">Шаг 0{index + 1}</p>
                <h2 className="mt-5 font-display text-h3 font-bold">{step.title}</h2>
                <p className="mt-4 text-body text-muted-foreground">{step.text}</p>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-background">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
            <div className="rounded-large border border-border bg-surface-elevated p-6 shadow-card">
              <p className="text-label font-bold uppercase text-primary">Что получает клиент</p>
              <h2 className="mt-5 font-display text-h2 font-extrabold">Не обещание «магии», а маршрут запуска</h2>
              <ul className="mt-6 space-y-3 text-body text-muted-foreground">
                <li>• список вводных для расчёта;</li>
                <li>• проверку применимости по нише и региону;</li>
                <li>• понятные ограничения до запуска;</li>
                <li>• следующий шаг для передачи задачи в работу.</li>
              </ul>
            </div>
            <div id="limits" className="rounded-large border border-border bg-surface p-6">
              <p className="text-label font-bold uppercase text-primary">Claim guard</p>
              <h2 className="mt-5 font-display text-h2 font-extrabold">Ограничения видны до CTA</h2>
              <div className="mt-6 space-y-4">
                {allowedClaims.map((claim) => (
                  <div className="rounded-card bg-surface-elevated p-4" key={claim.id}>
                    <p className="text-body-sm font-semibold">{claim.claim}</p>
                    <p className="mt-2 text-caption text-muted-foreground">{claim.legalReviewRoute}</p>
                  </div>
                ))}
                {reviewClaims.map((claim) => (
                  <div className="rounded-card border border-dashed border-border bg-surface-muted p-4" key={claim.id}>
                    <p className="text-body-sm font-semibold">Требует проверки перед публикацией</p>
                    <p className="mt-2 text-caption text-muted-foreground">{claim.legalReviewRoute}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="bg-surface">
        <Container>
          <SectionHeader
            eyebrow="FAQ"
            title="Честные ответы до расчёта"
            lead="FAQ закрывает риски, а не собирает неподтверждённые SEO-обещания."
          />
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {faqs.map((item) => (
              <article className="rounded-card border border-border bg-surface-elevated p-5 shadow-card" key={item.question}>
                <h2 className="font-display text-h3 font-bold">{item.question}</h2>
                <p className="mt-4 text-body-sm text-muted-foreground">{item.answer}</p>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section id="calculation" className="bg-surface-dark text-surface-dark-foreground">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="text-label font-bold uppercase text-surface-dark-faint">Следующий шаг</p>
              <h2 className="mt-5 font-display text-h2 font-extrabold">Рассчитать запуск Импульса</h2>
              <p className="mt-5 text-body-lg text-surface-dark-muted">
                Подготовьте нишу, регион и ограничения. Live-форма будет подключена в EPIC-08 через
                `/api/leads`, а сейчас страница фиксирует продуктовый CTA и контекст заявки.
              </p>
            </div>
            <div
              aria-label="Контекст будущей заявки"
              className="rounded-large border border-surface-dark-faint bg-surface-dark-elevated p-6 shadow-panel"
            >
              <p className="text-label font-bold uppercase text-surface-dark-faint">Lead context</p>
              <dl className="mt-5 grid gap-4 text-body-sm sm:grid-cols-2">
                <div>
                  <dt className="text-surface-dark-faint">product</dt>
                  <dd className="mt-1">impuls</dd>
                </div>
                <div>
                  <dt className="text-surface-dark-faint">cta</dt>
                  <dd className="mt-1">calculate-launch</dd>
                </div>
              </dl>
              <Button className="mt-6 h-12 w-full" disabled>
                Рассчитать запуск
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  )
}
