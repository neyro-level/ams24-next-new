import type { Metadata } from 'next'
import Link from 'next/link'

import { proofEvidenceInventory } from '@/core/content/services/proof-inventory'
import { Button } from '@/ui/primitives/button'
import { Container } from '@/ui/shared/container'
import { Section, SectionHeader } from '@/ui/shared/section'

export const metadata: Metadata = {
  title: 'Тарифы Импульс — условия готовятся',
  description:
    'Тарифы Импульс остаются скрыты до утверждения коммерческих правил, состава услуги, ограничений и допущений расчёта.',
  alternates: {
    canonical: '/tarify/',
  },
  robots: {
    index: false,
    follow: true,
  },
}

const tariffItems = proofEvidenceInventory.filter((item) => item.kind === 'tariff')

export default function TariffsPage() {
  return (
    <main>
      <Section spacing="hero" className="bg-surface-dark text-surface-dark-foreground">
        <Container>
          <div className="max-w-4xl">
            <p className="mb-5 text-label font-bold uppercase text-surface-dark-faint">Коммерческий контур</p>
            <h1 className="font-display text-display font-extrabold">Тарифы Импульс</h1>
            <p className="mt-7 text-body-lg text-surface-dark-muted">
              Публичные тарифы не публикуются до решения OD-02. Сейчас страница фиксирует
              структуру будущих условий: состав, ограничения, допущения и персональный расчёт.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-12 px-5">
                <Link href="/#lead-form">Получить персональный расчёт</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 border-surface-dark-faint bg-transparent px-5 text-surface-dark-foreground hover:bg-surface-dark-hover hover:text-surface-dark-foreground"
              >
                <Link href="/raschety/">Как считаются допущения</Link>
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="bg-background">
        <Container>
          <SectionHeader
            eyebrow="OD-02"
            title="Цена не раскрывается без утверждённых правил"
            lead="Для каждого продукта нужен подтверждённый состав услуги, единица расчёта, ограничения и список того, что считается индивидуально."
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {tariffItems.map((item) => (
              <article className="rounded-card border border-border bg-surface-elevated p-6 shadow-card" key={item.id}>
                <p className="text-label font-bold uppercase text-primary">Hidden tariff slot</p>
                <h2 className="mt-5 font-display text-h3 font-bold">{item.title}</h2>
                <p className="mt-4 text-body-sm text-muted-foreground">{item.hiddenReason}</p>
                <dl className="mt-6 grid gap-3 text-caption text-muted-foreground">
                  <div>
                    <dt className="font-bold text-foreground">publicationStatus</dt>
                    <dd>{item.publicationStatus}</dd>
                  </div>
                  <div>
                    <dt className="font-bold text-foreground">blockers</dt>
                    <dd>{item.blockers.join(', ')}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </Container>
      </Section>
    </main>
  )
}
