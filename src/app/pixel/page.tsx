import { getContentRepository } from '@/core/content/services/repository'
import { getClaimsForProduct, getPublicClaimsForProduct } from '@/core/content/services/product-claims'
import { buildMetadata } from '@/core/seo'
import { Button } from '@/ui/primitives/button'
import { Container } from '@/ui/shared/container'
import { Section, SectionHeader } from '@/ui/shared/section'

export const metadata = buildMetadata(getContentRepository().assertProductRef('pixel').seo)

const requirements = [
  'сайт получает собственный релевантный трафик',
  'есть страницы, где пользователь показывает коммерческий интерес',
  'понятно, кто обработает результат после проверки применимости',
] as const

const boundaries = [
  'не заявляем полный охват аудитории сайта',
  'не публикуем код установки без подтверждённого integration contract',
  'учитываем согласия, политику данных и юридическую проверку',
] as const

export default function PixelProductPage() {
  const repository = getContentRepository()
  const product = repository.assertProductRef('pixel')
  const allowedClaims = getPublicClaimsForProduct('pixel')
  const reviewClaims = getClaimsForProduct('pixel').filter((claim) => claim.publicationStatus === 'needs-review')

  return (
    <main>
      <Section spacing="hero" className="bg-surface-dark text-surface-dark-foreground">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.8fr)] lg:items-end">
            <div>
              <p className="mb-5 text-label font-bold uppercase text-surface-dark-faint">Продукт · AMS24</p>
              <h1 className="max-w-4xl font-display text-display font-extrabold text-surface-dark-foreground">
                Импульс Пиксель — определить заинтересованных посетителей сайта
              </h1>
              <p className="mt-7 max-w-3xl text-body-lg text-surface-dark-muted">
                Страница для компаний с собственным сайтом и входящим трафиком: проверяем,
                можно ли выделить часть заинтересованной аудитории и передать результат в продажи
                в согласованных границах.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="h-12 px-5">
                  <a href="#applicability">Проверить применимость</a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 border-surface-dark-faint bg-transparent px-5 text-surface-dark-foreground hover:bg-surface-dark-hover hover:text-surface-dark-foreground"
                >
                  <a href="#data-boundary">Граница данных</a>
                </Button>
              </div>
            </div>
            <aside
              aria-label="Краткая карточка продукта Импульс Пиксель"
              className="rounded-large border border-surface-dark-faint bg-surface-dark-elevated p-5 shadow-panel"
            >
              <p className="text-label font-bold uppercase text-surface-dark-faint">Own-site intent</p>
              <h2 className="mt-5 font-display text-h3 font-bold">{product.name}</h2>
              <p className="mt-4 text-body-sm text-surface-dark-muted">{product.promise}</p>
              <p className="mt-6 rounded-card border border-surface-dark-faint p-4 text-body-sm text-surface-dark-muted">
                Primary CTA: {product.primaryCta.label}
              </p>
            </aside>
          </div>
        </Container>
      </Section>

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
                <div className="rounded-card border border-border bg-surface-elevated p-5 shadow-card" key={item}>
                  <p className="text-label font-bold uppercase text-primary">Требование</p>
                  <p className="mt-4 text-body text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section id="data-boundary" className="bg-surface-muted">
        <Container>
          <SectionHeader
            eyebrow="Data boundary"
            title="Чётко отделяем применимость от неподтверждённых обещаний"
            lead="Пиксель не подменяет аналитику, CRM или юридическую проверку. На этой странице фиксируются только безопасные продуктовые границы."
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {boundaries.map((item) => (
              <article className="rounded-card border border-border bg-surface-elevated p-6 shadow-card" key={item}>
                <p className="text-label font-bold uppercase text-primary">Boundary</p>
                <h2 className="mt-5 font-display text-h3 font-bold">{item}</h2>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-background">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
            <div className="rounded-large border border-border bg-surface-elevated p-6 shadow-card">
              <p className="text-label font-bold uppercase text-primary">Что проверяем</p>
              <h2 className="mt-5 font-display text-h2 font-extrabold">Страницы, события и следующий шаг продаж</h2>
              <p className="mt-5 text-body text-muted-foreground">
                Для первичного разбора нужны ключевые страницы сайта, сценарии интереса, технический
                ответственный и понимание, как результат попадёт в продажи без лишних персональных
                данных в публичном контуре.
              </p>
            </div>
            <div className="rounded-large border border-border bg-surface p-6">
              <p className="text-label font-bold uppercase text-primary">Claim guard</p>
              <h2 className="mt-5 font-display text-h2 font-extrabold">Privacy ambiguity закрыта до CTA</h2>
              <div className="mt-6 space-y-4">
                {allowedClaims.map((claim) => (
                  <div className="rounded-card bg-surface-elevated p-4" key={claim.id}>
                    <p className="text-body-sm font-semibold">{claim.claim}</p>
                    <p className="mt-2 text-caption text-muted-foreground">{claim.legalReviewRoute}</p>
                  </div>
                ))}
                {reviewClaims.map((claim) => (
                  <div className="rounded-card border border-dashed border-border bg-surface-muted p-4" key={claim.id}>
                    <p className="text-body-sm font-semibold">Требует legal review перед публикацией</p>
                    <p className="mt-2 text-caption text-muted-foreground">{claim.legalReviewRoute}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section id="applicability" className="bg-surface-dark text-surface-dark-foreground">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="text-label font-bold uppercase text-surface-dark-faint">Следующий шаг</p>
              <h2 className="mt-5 font-display text-h2 font-extrabold">Проверить применимость пикселя</h2>
              <p className="mt-5 text-body-lg text-surface-dark-muted">
                Подготовьте адрес сайта, список важных страниц и контакт технического ответственного.
                Live-форма будет подключена в EPIC-08 через `/api/leads`.
              </p>
            </div>
            <div
              aria-label="Контекст будущей заявки на пиксель"
              className="rounded-large border border-surface-dark-faint bg-surface-dark-elevated p-6 shadow-panel"
            >
              <p className="text-label font-bold uppercase text-surface-dark-faint">Lead context</p>
              <dl className="mt-5 grid gap-4 text-body-sm sm:grid-cols-2">
                <div>
                  <dt className="text-surface-dark-faint">product</dt>
                  <dd className="mt-1">pixel</dd>
                </div>
                <div>
                  <dt className="text-surface-dark-faint">cta</dt>
                  <dd className="mt-1">check-pixel</dd>
                </div>
              </dl>
              <Button className="mt-6 h-12 w-full" disabled>
                Проверить применимость
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  )
}
