import type {
  ProductFaq,
  ProductStep,
} from '@/core/content/services/product-pages'
import type { ProductDTO } from '@/core/content/schemas'
import { Container } from '@/ui/shared/container'
import { Section } from '@/ui/shared/section'
import { SectionHeader } from '@/ui/shared/section-header'
import {
  ProductFaqSection,
  ProductHeroSection,
  ProductLeadSection,
  ProductStepsSection,
} from '@/ui/pages/shared/product-section'

type PublicClaim = { id: string; claim: string }

export function ImpulsHeroSection({ product }: { product: ProductDTO }) {
  return (
    <ProductHeroSection
      product={product}
      content={{
        title: 'Импульс — лидогенерация для бизнеса',
        description:
          'Коммерческая страница главного продукта: помогает понять, когда запуск привлечения лидов применим, какие вводные нужны для расчёта и какие обещания нельзя давать без доказательств.',
        primary: { href: '#calculation', label: 'Рассчитать запуск' },
        secondary: { href: '#limits', label: 'Посмотреть ограничения' },
        asideLabel: 'Краткая карточка продукта Импульс',
        asideEyebrow: 'Главный сценарий',
        asideRows: [
          {
            label: 'Основная задача',
            value: 'получить лиды через целевые аудитории',
          },
          { label: 'Следующий шаг', value: product.primaryCta.label },
        ],
      }}
    />
  )
}

export function ImpulsCriteriaSection({
  criteria,
}: {
  criteria: readonly string[]
}) {
  return (
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
              <div
                className="rounded-card border border-border bg-surface-elevated p-5 shadow-card"
                key={item}
              >
                <p className="text-label font-bold uppercase text-primary">
                  Критерий
                </p>
                <p className="mt-4 text-body text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}

export function ImpulsMechanicsSection({
  steps,
}: {
  steps: readonly ProductStep[]
}) {
  return (
    <ProductStepsSection
      eyebrow="Механика без лишнего шума"
      title="Сначала проверяем вводные, затем считаем запуск"
      lead="До юридического подтверждения не публикуем спорные формулировки про данные и операторские аудитории. В публичной логике остаётся проверяемый процесс: задача, применимость, расчёт, передача результата."
      steps={steps}
    />
  )
}

export function ImpulsLimitsSection({
  allowedClaims,
}: {
  allowedClaims: readonly PublicClaim[]
}) {
  return (
    <Section className="bg-background">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-large border border-border bg-surface-elevated p-6 shadow-card">
            <p className="text-label font-bold uppercase text-primary">
              Что получает клиент
            </p>
            <h2 className="mt-5 font-display text-h2 font-extrabold">
              Не обещание «магии», а маршрут запуска
            </h2>
            <ul className="mt-6 space-y-3 text-body text-muted-foreground">
              <li>• список вводных для расчёта;</li>
              <li>• проверку применимости по нише и региону;</li>
              <li>• понятные ограничения до запуска;</li>
              <li>• следующий шаг для передачи задачи в работу.</li>
            </ul>
          </div>
          <div
            id="limits"
            className="rounded-large border border-border bg-surface p-6"
          >
            <p className="text-label font-bold uppercase text-primary">
              Ограничения
            </p>
            <h2 className="mt-5 font-display text-h2 font-extrabold">
              Что можно обещать до расчёта
            </h2>
            <div className="mt-6 space-y-4">
              {allowedClaims.map((claim) => (
                <div
                  className="rounded-card bg-surface-elevated p-4"
                  key={claim.id}
                >
                  <p className="text-body-sm font-semibold">{claim.claim}</p>
                  <p className="mt-2 text-caption text-muted-foreground">
                    Проверено по утверждённым материалам проекта.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}

export function ImpulsFaqSection({ faqs }: { faqs: readonly ProductFaq[] }) {
  return (
    <ProductFaqSection
      title="Честные ответы до расчёта"
      lead="FAQ закрывает риски, а не собирает неподтверждённые SEO-обещания."
      faqs={faqs}
    />
  )
}

export function ImpulsLeadSection() {
  return (
    <ProductLeadSection
      content={{
        id: 'calculation',
        mode: 'form',
        title: 'Рассчитать запуск Импульса',
        description:
          'Подготовьте нишу, регион и ограничения. Сейчас форма не отправляет персональные данные и помогает заранее собрать контекст задачи.',
        context: {
          product: 'impuls',
          route: '/impuls/',
          ctaId: 'calculate-launch',
        },
        formTitle: 'Рассчитать запуск Импульса',
        formDescription:
          'Форма сохраняет контекст продукта и будущего обращения, но не отправляет персональные данные до финального согласования.',
      }}
    />
  )
}
