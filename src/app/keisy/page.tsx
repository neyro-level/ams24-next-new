import Link from 'next/link'

import { proofEvidenceInventory } from '@/core/content/services/proof-inventory'
import { buildNoindexMetadata } from '@/core/seo'
import { Button } from '@/ui/primitives/button'
import { Container } from '@/ui/shared/container'
import { Section, SectionHeader } from '@/ui/shared/section'

export const metadata = buildNoindexMetadata({
  title: 'Кейсы Импульс — evidence guard',
  description:
    'Кейсы Импульс остаются скрыты до подтверждения ниши, периода, методики, метрик и разрешения на публикацию.',
  canonicalPath: '/keisy/',
})

const caseItems = proofEvidenceInventory.filter((item) => item.kind === 'case')

export default function CasesPage() {
  return (
    <main>
      <Section spacing="hero" className="bg-surface-dark text-surface-dark-foreground">
        <Container>
          <div className="max-w-4xl">
            <p className="mb-5 text-label font-bold uppercase text-surface-dark-faint">Доказательства</p>
            <h1 className="font-display text-display font-extrabold">Кейсы Импульс</h1>
            <p className="mt-7 text-body-lg text-surface-dark-muted">
              Хаб кейсов готовит release-minimum набор, но не публикует неподтверждённые истории.
              Каждый кейс должен иметь нишу, период, источник, методику, метрики и permission state.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-12 px-5">
                <Link href="/#lead-form">Обсудить похожую задачу</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 border-surface-dark-faint bg-transparent px-5 text-surface-dark-foreground hover:bg-surface-dark-hover hover:text-surface-dark-foreground"
              >
                <Link href="/raschety/">Посмотреть допущения расчёта</Link>
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="bg-background">
        <Container>
          <SectionHeader
            eyebrow="Evidence contract"
            title="Неполные кейсы остаются hidden"
            lead="OD-01 ещё открыт, поэтому страница сохраняет слоты первого релиза, но не делает их indexable или публичным доказательством."
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {caseItems.map((item) => (
              <article className="rounded-card border border-border bg-surface-elevated p-6 shadow-card" key={item.id}>
                <p className="text-label font-bold uppercase text-primary">{item.releaseMinimumSlot}</p>
                <h2 className="mt-5 font-display text-h3 font-bold">{item.title}</h2>
                <p className="mt-4 text-body-sm text-muted-foreground">{item.hiddenReason}</p>
                <dl className="mt-6 grid gap-3 text-caption text-muted-foreground">
                  <div>
                    <dt className="font-bold text-foreground">publicationStatus</dt>
                    <dd>{item.publicationStatus}</dd>
                  </div>
                  <div>
                    <dt className="font-bold text-foreground">permissionState</dt>
                    <dd>{item.permissionState}</dd>
                  </div>
                  <div>
                    <dt className="font-bold text-foreground">required</dt>
                    <dd>source, period, methodology, metrics, publication permission</dd>
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
