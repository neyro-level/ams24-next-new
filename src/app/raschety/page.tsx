import type { Metadata } from 'next'
import Link from 'next/link'

import { proofEvidenceInventory } from '@/project/proof-inventory'
import { Button } from '@/ui/primitives/button'
import { Container } from '@/ui/shared/container'
import { Section, SectionHeader } from '@/ui/shared/section'

export const metadata: Metadata = {
  title: 'Расчёты Импульс — допущения и ограничения',
  description:
    'Расчёты Импульс показывают будущую структуру входных данных и ограничений без неподтверждённых цен, диапазонов и гарантий.',
  alternates: {
    canonical: '/raschety/',
  },
  robots: {
    index: false,
    follow: true,
  },
}

const calculationItems = proofEvidenceInventory.filter((item) => item.kind === 'calculation')

const assumptionGroups = [
  'ниша, регион и сезонность спроса',
  'формат полезного обращения и готовность отдела продаж',
  'юридические ограничения, согласия и способ передачи результата',
] as const

export default function CalculationsPage() {
  return (
    <main>
      <Section spacing="hero" className="bg-surface-dark text-surface-dark-foreground">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.75fr)] lg:items-end">
            <div>
              <p className="mb-5 text-label font-bold uppercase text-surface-dark-faint">Расчёт без ложной точности</p>
              <h1 className="font-display text-display font-extrabold">Расчёты Импульс</h1>
              <p className="mt-7 max-w-3xl text-body-lg text-surface-dark-muted">
                До OD-02 эта страница не публикует цену, диапазоны или обещания результата. Она
                фиксирует, какие допущения нужны для персонального расчёта запуска.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="h-12 px-5">
                  <Link href="/#lead-form">Запросить расчёт</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 border-surface-dark-faint bg-transparent px-5 text-surface-dark-foreground hover:bg-surface-dark-hover hover:text-surface-dark-foreground"
                >
                  <Link href="/tarify/">К тарифным условиям</Link>
                </Button>
              </div>
            </div>
            <aside
              aria-label="Статус расчётных примеров"
              className="rounded-large border border-surface-dark-faint bg-surface-dark-elevated p-5 shadow-panel"
            >
              <p className="text-label font-bold uppercase text-surface-dark-faint">Publication guard</p>
              <h2 className="mt-5 font-display text-h3 font-bold">noindex до утверждения</h2>
              <p className="mt-4 text-body-sm text-surface-dark-muted">
                Расчётные примеры остаются скрыты, пока не утверждены коммерческие правила и ограничения.
              </p>
            </aside>
          </div>
        </Container>
      </Section>

      <Section className="bg-background">
        <Container>
          <SectionHeader
            eyebrow="Assumptions"
            title="Что нужно для персонального расчёта"
            lead="Вместо универсальной цены страница показывает проверяемые входные данные, которые влияют на применимость и следующий шаг."
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {assumptionGroups.map((item) => (
              <article className="rounded-card border border-border bg-surface-elevated p-6 shadow-card" key={item}>
                <p className="text-label font-bold uppercase text-primary">Допущение</p>
                <h2 className="mt-5 font-display text-h3 font-bold">{item}</h2>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-surface-muted">
        <Container>
          <SectionHeader
            eyebrow="Inventory"
            title="Расчётные примеры скрыты до OD-02"
            lead="Этот блок связан с evidence inventory и не допускает публикацию неподтверждённых диапазонов."
          />
          <div className="mt-10 space-y-4">
            {calculationItems.map((item) => (
              <article className="rounded-card border border-border bg-surface-elevated p-6 shadow-card" key={item.id}>
                <h2 className="font-display text-h3 font-bold">{item.title}</h2>
                <p className="mt-4 text-body-sm text-muted-foreground">{item.hiddenReason}</p>
                <p className="mt-4 text-caption text-muted-foreground">
                  publicationStatus: {item.publicationStatus}; blockers: {item.blockers.join(', ')}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </Section>
    </main>
  )
}
