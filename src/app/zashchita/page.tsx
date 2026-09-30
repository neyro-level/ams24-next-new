import { getContentRepository } from '@/core/content/services/repository'
import { getPublicClaimsForProduct } from '@/core/content/services/product-claims'
import { buildMetadata } from '@/core/seo'
import { Button } from '@/ui/primitives/button'
import { Container } from '@/ui/shared/container'
import { Section, SectionHeader } from '@/ui/shared/section'

export const metadata = buildMetadata(getContentRepository().assertProductRef('zashchita').seo)

const symptoms = [
  'резко меняется качество заявок без понятной причины',
  'лиды быстро оказываются у других участников рынка',
  'рекламный трафик дорожает, а результат падает',
] as const

const auditSteps = [
  {
    title: 'Карта точек входа',
    text: 'Собираем рекламные каналы, посадочные страницы, формы, телефонию и подрядчиков.',
  },
  {
    title: 'Проверка симптомов',
    text: 'Отделяем подтверждённые факты от гипотез и фиксируем периоды, где риск проявляется сильнее.',
  },
  {
    title: 'Меры снижения риска',
    text: 'Формируем список действий: доступы, контроль точек контакта, мониторинг и повторная проверка.',
  },
] as const

export default function ZashchitaProductPage() {
  const repository = getContentRepository()
  const product = repository.assertProductRef('zashchita')
  const allowedClaims = getPublicClaimsForProduct('zashchita')

  return (
    <main>
      <Section spacing="hero" className="bg-surface-dark text-surface-dark-foreground">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.8fr)] lg:items-end">
            <div>
              <p className="mb-5 text-label font-bold uppercase text-surface-dark-faint">Продукт · AMS24</p>
              <h1 className="max-w-4xl font-display text-display font-extrabold text-surface-dark-foreground">
                Импульс Защита — аудит риска перехвата лидов
              </h1>
              <p className="mt-7 max-w-3xl text-body-lg text-surface-dark-muted">
                Страница для компаний, которые видят признаки утечки рекламного трафика или
                ухудшения качества заявок. Начинаем с аудита, затем выбираем меры снижения риска.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="xl">
                  <a href="#audit">Провести аудит</a>
                </Button>
                <Button asChild variant="outlineDark" size="xl">
                  <a href="#limits">Что нельзя гарантировать</a>
                </Button>
              </div>
            </div>
            <aside
              aria-label="Краткая карточка продукта Импульс Защита"
              className="rounded-large border border-surface-dark-faint bg-surface-dark-elevated p-5 shadow-panel"
            >
              <p className="text-label font-bold uppercase text-surface-dark-faint">Маршрут аудита</p>
              <h2 className="mt-5 font-display text-h3 font-bold">{product.name}</h2>
              <p className="mt-4 text-body-sm text-surface-dark-muted">{product.promise}</p>
              <p className="mt-6 rounded-card border border-surface-dark-faint p-4 text-body-sm text-surface-dark-muted">
                Следующий шаг: {product.primaryCta.label}
              </p>
            </aside>
          </div>
        </Container>
      </Section>

      <Section className="bg-background">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <SectionHeader
              eyebrow="Признаки риска"
              title="Сначала фиксируем признаки риска"
              lead="Один симптом не доказывает перехват. Страница помогает собрать наблюдения и перейти к проверяемому аудиту."
            />
            <div className="grid gap-4 sm:grid-cols-3">
              {symptoms.map((item) => (
                <div className="rounded-card border border-border bg-surface-elevated p-5 shadow-card" key={item}>
                  <p className="text-label font-bold uppercase text-primary">Симптом</p>
                  <p className="mt-4 text-body text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section id="audit" className="bg-surface-muted">
        <Container>
          <SectionHeader
            eyebrow="Аудит и меры"
            title="Проверка строится как последовательность, а не как обвинение"
            lead="Мы не называем виновных без доказательств и не обещаем абсолютный результат. Ценность страницы — в понятном маршруте проверки и мер."
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {auditSteps.map((step, index) => (
              <article className="rounded-card border border-border bg-surface-elevated p-6 shadow-card" key={step.title}>
                <p className="text-label font-bold uppercase text-primary">Шаг 0{index + 1}</p>
                <h2 className="mt-5 font-display text-h3 font-bold">{step.title}</h2>
                <p className="mt-4 text-body text-muted-foreground">{step.text}</p>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section id="limits" className="bg-background">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
            <div className="rounded-large border border-border bg-surface-elevated p-6 shadow-card">
              <p className="text-label font-bold uppercase text-primary">Граница обещаний</p>
              <h2 className="mt-5 font-display text-h2 font-extrabold">Защита — это снижение риска, а не абсолютная гарантия</h2>
              <p className="mt-5 text-body text-muted-foreground">
                Публичная страница не обещает невозможность перехвата. Она показывает, как провести
                аудит, какие зоны проверить и какие меры можно обсуждать после диагностики.
              </p>
            </div>
            <div className="rounded-large border border-border bg-surface p-6">
              <p className="text-label font-bold uppercase text-primary">Ограничения</p>
              <h2 className="mt-5 font-display text-h2 font-extrabold">Абсолютных гарантий нет</h2>
              <div className="mt-6 space-y-4">
                {allowedClaims.map((claim) => (
                  <div className="rounded-card bg-surface-elevated p-4" key={claim.id}>
                    <p className="text-body-sm font-semibold">{claim.claim}</p>
                    <p className="mt-2 text-caption text-muted-foreground">Проверено по утверждённым материалам проекта.</p>
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
            title="Что важно понять до аудита"
            lead="Эта страница снижает тревогу через порядок проверки, а не через громкие обещания."
          />
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {[
              ['Аудит докажет, кто перехватывает лиды?', 'Нет. Аудит начинается с признаков риска и проверяемых точек, а выводы зависят от данных.'],
              ['Можно ли защититься один раз и навсегда?', 'Нет. Нужны меры, контроль и повторные проверки, потому что каналы и подрядчики меняются.'],
              ['Что подготовить перед обращением?', 'Каналы, посадочные страницы, формы, телефонию, периоды изменений и примеры подозрительных ситуаций.'],
            ].map(([question, answer]) => (
              <article className="rounded-card border border-border bg-surface-elevated p-5 shadow-card" key={question}>
                <h2 className="font-display text-h3 font-bold">{question}</h2>
                <p className="mt-4 text-body-sm text-muted-foreground">{answer}</p>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-surface-dark text-surface-dark-foreground">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="text-label font-bold uppercase text-surface-dark-faint">Следующий шаг</p>
              <h2 className="mt-5 font-display text-h2 font-extrabold">Провести аудит защиты лидов</h2>
              <p className="mt-5 text-body-lg text-surface-dark-muted">
                Соберите симптомы, рекламные каналы и точки входа. Сейчас кнопка не отправляет
                персональные данные и показывает будущий сценарий обращения.
              </p>
            </div>
            <div
              aria-label="Контекст будущей заявки на аудит защиты"
              className="rounded-large border border-surface-dark-faint bg-surface-dark-elevated p-6 shadow-panel"
            >
              <p className="text-label font-bold uppercase text-surface-dark-faint">Что передать</p>
              <dl className="mt-5 grid gap-4 text-body-sm sm:grid-cols-2">
                <div>
                  <dt className="text-surface-dark-faint">Продукт</dt>
                  <dd className="mt-1">zashchita</dd>
                </div>
                <div>
                  <dt className="text-surface-dark-faint">Действие</dt>
                  <dd className="mt-1">request-audit</dd>
                </div>
              </dl>
              <Button className="mt-6 w-full" disabled size="xl">
                Провести аудит
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  )
}
