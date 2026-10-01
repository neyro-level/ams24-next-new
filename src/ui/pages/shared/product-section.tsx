import type {
  ProductFaq,
  ProductStep,
} from '@/core/content/services/product-pages'
import type { ProductDTO } from '@/core/content/schemas'
import type { LeadContext } from '@/core/leads'
import { LeadForm } from '@/ui/forms/lead-form'
import { Button } from '@/ui/primitives/button'
import { Container } from '@/ui/shared/container'
import { Section } from '@/ui/shared/section'
import { SectionHeader } from '@/ui/shared/section-header'

type HeroContent = {
  title: string
  description: string
  primary: { href: string; label: string }
  secondary: { href: string; label: string }
  asideLabel: string
  asideEyebrow: string
  asideRows?: readonly { label: string; value: string }[]
}

export function ProductHeroSection({
  product,
  content,
}: {
  product: ProductDTO
  content: HeroContent
}) {
  return (
    <Section
      spacing="hero"
      className="bg-surface-dark text-surface-dark-foreground"
    >
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.8fr)] lg:items-end">
          <div>
            <p className="mb-5 text-label font-bold uppercase text-surface-dark-faint">
              Продукт · AMS24
            </p>
            <h1 className="max-w-4xl font-display text-display font-extrabold text-surface-dark-foreground">
              {content.title}
            </h1>
            <p className="mt-7 max-w-3xl text-body-lg text-surface-dark-muted">
              {content.description}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="xl">
                <a href={content.primary.href}>{content.primary.label}</a>
              </Button>
              <Button asChild size="xl" variant="outlineDark">
                <a href={content.secondary.href}>{content.secondary.label}</a>
              </Button>
            </div>
          </div>
          <aside
            aria-label={content.asideLabel}
            className="rounded-large border border-surface-dark-faint bg-surface-dark-elevated p-5 shadow-panel"
          >
            <p className="text-label font-bold uppercase text-surface-dark-faint">
              {content.asideEyebrow}
            </p>
            <h2 className="mt-5 font-display text-h3 font-bold">
              {product.name}
            </h2>
            <p className="mt-4 text-body-sm text-surface-dark-muted">
              {product.promise}
            </p>
            {content.asideRows ? (
              <dl className="mt-6 space-y-4 text-body-sm">
                {content.asideRows.map((row) => (
                  <div key={row.label}>
                    <dt className="text-surface-dark-faint">{row.label}</dt>
                    <dd className="mt-1">{row.value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="mt-6 rounded-card border border-surface-dark-faint p-4 text-body-sm text-surface-dark-muted">
                Следующий шаг: {product.primaryCta.label}
              </p>
            )}
          </aside>
        </div>
      </Container>
    </Section>
  )
}

export function ProductStepsSection({
  id,
  eyebrow,
  title,
  lead,
  steps,
}: {
  id?: string
  eyebrow: string
  title: string
  lead: string
  steps: readonly ProductStep[]
}) {
  return (
    <Section id={id} className="bg-surface-muted">
      <Container>
        <SectionHeader eyebrow={eyebrow} title={title} lead={lead} />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {steps.map((step, index) => (
            <article
              className="rounded-card border border-border bg-surface-elevated p-6 shadow-card"
              key={step.title}
            >
              <p className="text-label font-bold uppercase text-primary">
                Шаг 0{index + 1}
              </p>
              <h2 className="mt-5 font-display text-h3 font-bold">
                {step.title}
              </h2>
              <p className="mt-4 text-body text-muted-foreground">
                {step.text}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  )
}

export function ProductFaqSection({
  title,
  lead,
  faqs,
}: {
  title: string
  lead: string
  faqs: readonly ProductFaq[]
}) {
  return (
    <Section className="bg-surface">
      <Container>
        <SectionHeader eyebrow="FAQ" title={title} lead={lead} />
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {faqs.map((item) => (
            <article
              className="rounded-card border border-border bg-surface-elevated p-5 shadow-card"
              key={item.question}
            >
              <h2 className="font-display text-h3 font-bold">
                {item.question}
              </h2>
              <p className="mt-4 text-body-sm text-muted-foreground">
                {item.answer}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  )
}

type LeadContent = { id?: string; title: string; description: string } & (
  | {
      mode: 'form'
      context: LeadContext
      formTitle: string
      formDescription: string
    }
  | {
      mode: 'summary'
      ariaLabel: string
      product: string
      action: string
      buttonLabel: string
    }
)

export function ProductLeadSection({ content }: { content: LeadContent }) {
  return (
    <Section
      id={content.id}
      className="bg-surface-dark text-surface-dark-foreground"
    >
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="text-label font-bold uppercase text-surface-dark-faint">
              Следующий шаг
            </p>
            <h2 className="mt-5 font-display text-h2 font-extrabold">
              {content.title}
            </h2>
            <p className="mt-5 text-body-lg text-surface-dark-muted">
              {content.description}
            </p>
          </div>
          {content.mode === 'form' ? (
            <LeadForm
              context={content.context}
              title={content.formTitle}
              description={content.formDescription}
            />
          ) : (
            <div
              aria-label={content.ariaLabel}
              className="rounded-large border border-surface-dark-faint bg-surface-dark-elevated p-6 shadow-panel"
            >
              <p className="text-label font-bold uppercase text-surface-dark-faint">
                Что передать
              </p>
              <dl className="mt-5 grid gap-4 text-body-sm sm:grid-cols-2">
                <div>
                  <dt className="text-surface-dark-faint">Продукт</dt>
                  <dd className="mt-1">{content.product}</dd>
                </div>
                <div>
                  <dt className="text-surface-dark-faint">Действие</dt>
                  <dd className="mt-1">{content.action}</dd>
                </div>
              </dl>
              <Button className="mt-6 w-full" disabled size="xl">
                {content.buttonLabel}
              </Button>
            </div>
          )}
        </div>
      </Container>
    </Section>
  )
}
