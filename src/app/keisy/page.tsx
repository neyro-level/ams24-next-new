import Link from 'next/link'

import { getProofEvidenceInventory } from '@/core/content/services/proof-inventory'
import { getRequiredSiteSettings } from '@/core/content/services/site-settings'
import { buildNoindexMetadata } from '@/core/seo'
import { Button } from '@/ui/primitives/button'
import { Container } from '@/ui/shared/container'
import { Section } from '@/ui/shared/section'
import { SectionHeader } from '@/ui/shared/section-header'

export async function generateMetadata() {
  return buildNoindexMetadata({
    title: 'Кейсы Импульс — материалы готовятся',
    description:
      'Кейсы Импульс остаются скрыты до подтверждения ниши, периода, методики, метрик и разрешения на публикацию.',
    canonicalPath: '/keisy/',
  }, await getRequiredSiteSettings())
}

const caseItems = getProofEvidenceInventory().filter((item) => item.kind === 'case')

export default function CasesPage() {
  return (
    <main>
      <Section spacing="hero" className="bg-surface-dark text-surface-dark-foreground">
        <Container>
          <div className="max-w-4xl">
            <p className="mb-5 text-label font-bold uppercase text-surface-dark-faint">Доказательства</p>
            <h1 className="font-display text-display font-extrabold">Кейсы Импульс</h1>
            <p className="mt-7 text-body-lg text-surface-dark-muted">
              Хаб кейсов готовит набор первого релиза, но не публикует неподтверждённые истории.
              Каждый кейс должен иметь нишу, период, источник, методику, метрики и разрешение на публикацию.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="xl">
                <Link href="/#lead-form">Обсудить похожую задачу</Link>
              </Button>
              <Button asChild variant="outlineDark" size="xl">
                <Link href="/raschety/">Посмотреть допущения расчёта</Link>
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="bg-background">
        <Container>
          <SectionHeader
            eyebrow="Требования к кейсам"
            title="Неполные кейсы остаются скрыты"
            lead="Пока нет подтверждённых материалов, страница сохраняет будущие темы первого релиза, но не выдаёт их за публичное доказательство."
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {caseItems.map((item) => (
              <article className="rounded-card border border-border bg-surface-elevated p-6 shadow-card" key={item.id}>
                <p className="text-label font-bold uppercase text-primary">{item.releaseMinimumSlot}</p>
                <h2 className="mt-5 font-display text-h3 font-bold">{item.title}</h2>
                <p className="mt-4 text-body-sm text-muted-foreground">{item.hiddenReason}</p>
                <dl className="mt-6 grid gap-3 text-caption text-muted-foreground">
                  <div>
                    <dt className="font-bold text-foreground">Статус</dt>
                    <dd>скрыто до подтверждения</dd>
                  </div>
                  <div>
                    <dt className="font-bold text-foreground">Разрешение</dt>
                    <dd>требуется перед публикацией</dd>
                  </div>
                  <div>
                    <dt className="font-bold text-foreground">Что требуется</dt>
                    <dd>источник, период, методика, метрики и разрешение на публикацию</dd>
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
