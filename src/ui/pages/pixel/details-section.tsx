import type { ProductDTO } from '@/core/content/schemas'
import { Container } from '@/ui/shared/container'
import { Section } from '@/ui/shared/section'
import { SectionHeader } from '@/ui/shared/section-header'
import {
  ProductHeroSection,
  ProductLeadSection,
} from '@/ui/pages/shared/product-section'

type PublicClaim = { id: string; claim: string }

export function PixelHeroSection({ product }: { product: ProductDTO }) {
  return (
    <ProductHeroSection
      product={product}
      content={{
        title:
          'Импульс Пиксель — определить заинтересованных посетителей сайта',
        description:
          'Страница для компаний с собственным сайтом и входящим трафиком: проверяем, можно ли выделить часть заинтересованной аудитории и передать результат в продажи в согласованных границах.',
        primary: { href: '#applicability', label: 'Проверить применимость' },
        secondary: { href: '#data-boundary', label: 'Граница данных' },
        asideLabel: 'Краткая карточка продукта Импульс Пиксель',
        asideEyebrow: 'Свой сайт',
      }}
    />
  )
}

export function PixelRequirementsSection({
  requirements,
}: {
  requirements: readonly string[]
}) {
  return (
    <Section className="bg-background">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <SectionHeader
            eyebrow="Требования"
            title="Пиксель начинается не с кода, а с готовности сайта"
            lead="Сначала проверяем, есть ли у сайта трафик, коммерческие страницы и понятный сценарий работы с результатом."
          />
          <div className="grid gap-4 sm:grid-cols-3">
            {requirements.map((item) => (
              <div
                className="rounded-card border border-border bg-surface-elevated p-5 shadow-card"
                key={item}
              >
                <p className="text-label font-bold uppercase text-primary">
                  Требование
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

export function PixelDataBoundarySection({
  boundaries,
}: {
  boundaries: readonly string[]
}) {
  return (
    <Section id="data-boundary" className="bg-surface-muted">
      <Container>
        <SectionHeader
          eyebrow="Граница данных"
          title="Чётко отделяем применимость от неподтверждённых обещаний"
          lead="Пиксель не подменяет аналитику, CRM или юридическую проверку. На этой странице фиксируются только безопасные продуктовые границы."
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {boundaries.map((item) => (
            <article
              className="rounded-card border border-border bg-surface-elevated p-6 shadow-card"
              key={item}
            >
              <p className="text-label font-bold uppercase text-primary">
                Граница
              </p>
              <h3 className="mt-5 font-display text-h3 font-bold">{item}</h3>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  )
}

export function PixelLimitsSection({
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
              Что проверяем
            </p>
            <h2 className="mt-5 font-display text-h2 font-extrabold">
              Страницы, события и следующий шаг продаж
            </h2>
            <p className="mt-5 text-body text-muted-foreground">
              Для первичного разбора нужны ключевые страницы сайта, сценарии
              интереса, технический ответственный и понимание, как результат
              попадёт в продажи без лишних персональных данных в публичном
              контуре.
            </p>
          </div>
          <div className="rounded-large border border-border bg-surface p-6">
            <p className="text-label font-bold uppercase text-primary">
              Ограничения
            </p>
            <h2 className="mt-5 font-display text-h2 font-extrabold">
              Приватность учитывается до обращения
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

export function PixelApplicabilitySection() {
  return (
    <ProductLeadSection
      content={{
        id: 'applicability',
        mode: 'summary',
        title: 'Проверить применимость пикселя',
        description:
          'Подготовьте адрес сайта, список важных страниц и контакт технического ответственного. Сейчас кнопка не отправляет персональные данные и показывает будущий сценарий заявки.',
        ariaLabel: 'Контекст будущей заявки на пиксель',
        product: 'pixel',
        action: 'check-pixel',
        buttonLabel: 'Проверить применимость',
      }}
    />
  )
}
