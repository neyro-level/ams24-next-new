import Link from 'next/link'

import { getProofEvidenceInventory } from '@/core/content/services/proof-inventory'
import { getRequiredSiteSettings } from '@/core/content/services/site-settings'
import { buildNoindexMetadata } from '@/core/seo'
import { Button } from '@/ui/primitives/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/ui/primitives/card'
import { Container } from '@/ui/shared/container'
import { Section } from '@/ui/shared/section'
import { SectionHeader } from '@/ui/shared/section-header'

export async function generateMetadata() {
  return buildNoindexMetadata({
    title: 'Расчёты Импульс — допущения и ограничения',
    description:
      'Расчёты Импульс показывают будущую структуру входных данных и ограничений без неподтверждённых цен, диапазонов и гарантий.',
    canonicalPath: '/raschety/',
  }, await getRequiredSiteSettings())
}

const calculationItems = getProofEvidenceInventory().filter((item) => item.kind === 'calculation')

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
                До утверждения коммерческих правил эта страница не публикует цену, диапазоны или
                обещания результата. Она фиксирует, какие допущения нужны для персонального расчёта запуска.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="xl">
                  <Link href="/#lead-form">Запросить расчёт</Link>
                </Button>
                <Button asChild variant="outlineDark" size="xl">
                  <Link href="/tarify/">К тарифным условиям</Link>
                </Button>
              </div>
            </div>
            <Card asChild variant="dark">
              <aside aria-label="Статус расчётных примеров">
                <CardHeader>
                  <p className="text-label font-bold uppercase text-surface-dark-faint">Проверка условий</p>
                  <CardTitle asChild><h3>Скрыто до утверждения</h3></CardTitle>
                  <CardDescription asChild>
                    <p>Расчётные примеры остаются скрыты, пока не утверждены коммерческие правила и ограничения.</p>
                  </CardDescription>
                </CardHeader>
              </aside>
            </Card>
          </div>
        </Container>
      </Section>

      <Section className="bg-background">
        <Container>
          <SectionHeader
            eyebrow="Допущения"
            title="Что нужно для персонального расчёта"
            lead="Вместо универсальной цены страница показывает проверяемые входные данные, которые влияют на применимость и следующий шаг."
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {assumptionGroups.map((item) => (
              <Card asChild key={item} variant="muted">
                <article>
                  <CardHeader>
                    <p className="text-label font-bold uppercase text-primary">Допущение</p>
                    <CardTitle asChild><h3>{item}</h3></CardTitle>
                  </CardHeader>
                </article>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-surface-muted">
        <Container>
          <SectionHeader
            eyebrow="Примеры"
            title="Расчётные примеры скрыты до утверждения"
            lead="Этот блок не допускает публикацию неподтверждённых диапазонов и точных обещаний."
          />
          <div className="mt-10 space-y-4">
            {calculationItems.map((item) => (
              <Card asChild key={item.id}>
                <article>
                  <CardHeader>
                    <CardTitle asChild><h3>{item.title}</h3></CardTitle>
                    <CardDescription asChild><p>{item.hiddenReason}</p></CardDescription>
                    <p className="text-caption text-muted-foreground">
                      Статус: скрыто до утверждения коммерческих правил и ограничений.
                    </p>
                  </CardHeader>
                </article>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    </main>
  )
}
