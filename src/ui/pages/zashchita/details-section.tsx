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

export function ZashchitaHeroSection({ product }: { product: ProductDTO }) {
  return (
    <ProductHeroSection
      product={product}
      content={{
        title: 'Импульс Защита — аудит риска перехвата лидов',
        description:
          'Страница для компаний, которые видят признаки утечки рекламного трафика или ухудшения качества заявок. Начинаем с аудита, затем выбираем меры снижения риска.',
        primary: { href: '#audit', label: 'Провести аудит' },
        secondary: { href: '#limits', label: 'Что нельзя гарантировать' },
        asideLabel: 'Краткая карточка продукта Импульс Защита',
        asideEyebrow: 'Маршрут аудита',
      }}
    />
  )
}

export function ZashchitaSymptomsSection({
  symptoms,
}: {
  symptoms: readonly string[]
}) {
  return (
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
              <div
                className="rounded-card border border-border bg-surface-elevated p-5 shadow-card"
                key={item}
              >
                <p className="text-label font-bold uppercase text-primary">
                  Симптом
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

export function ZashchitaAuditSection({
  steps,
}: {
  steps: readonly ProductStep[]
}) {
  return (
    <ProductStepsSection
      id="audit"
      eyebrow="Аудит и меры"
      title="Проверка строится как последовательность, а не как обвинение"
      lead="Мы не называем виновных без доказательств и не обещаем абсолютный результат. Ценность страницы — в понятном маршруте проверки и мер."
      steps={steps}
    />
  )
}

export function ZashchitaLimitsSection({
  allowedClaims,
}: {
  allowedClaims: readonly PublicClaim[]
}) {
  return (
    <Section id="limits" className="bg-background">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-large border border-border bg-surface-elevated p-6 shadow-card">
            <p className="text-label font-bold uppercase text-primary">
              Граница обещаний
            </p>
            <h2 className="mt-5 font-display text-h2 font-extrabold">
              Защита — это снижение риска, а не абсолютная гарантия
            </h2>
            <p className="mt-5 text-body text-muted-foreground">
              Публичная страница не обещает невозможность перехвата. Она
              показывает, как провести аудит, какие зоны проверить и какие меры
              можно обсуждать после диагностики.
            </p>
          </div>
          <div className="rounded-large border border-border bg-surface p-6">
            <p className="text-label font-bold uppercase text-primary">
              Ограничения
            </p>
            <h2 className="mt-5 font-display text-h2 font-extrabold">
              Абсолютных гарантий нет
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

export function ZashchitaFaqSection({ faqs }: { faqs: readonly ProductFaq[] }) {
  return (
    <ProductFaqSection
      title="Что важно понять до аудита"
      lead="Эта страница снижает тревогу через порядок проверки, а не через громкие обещания."
      faqs={faqs}
    />
  )
}

export function ZashchitaLeadSection() {
  return (
    <ProductLeadSection
      content={{
        mode: 'summary',
        title: 'Провести аудит защиты лидов',
        description:
          'Соберите симптомы, рекламные каналы и точки входа. Форма подсказывает, какие данные понадобятся для аудита, и пока не отправляет персональные данные.',
        ariaLabel: 'Контекст заявки на аудит защиты',
        product: 'zashchita',
        action: 'request-audit',
        buttonLabel: 'Провести аудит',
      }}
    />
  )
}
