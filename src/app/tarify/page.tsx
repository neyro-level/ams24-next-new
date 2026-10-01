import Link from 'next/link'

import { getProofEvidenceInventory } from '@/core/content/services/proof-inventory'
import { getRequiredSiteSettings } from '@/core/content/services/site-settings'
import { buildNoindexMetadata } from '@/core/seo'
import { Button } from '@/ui/primitives/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/primitives/card'
import { Container } from '@/ui/shared/container'
import { Section } from '@/ui/shared/section'
import { SectionHeader } from '@/ui/shared/section-header'

export async function generateMetadata() {
  return buildNoindexMetadata({
    title: 'Тарифы Импульс — условия готовятся',
    description:
      'Тарифы Импульс остаются скрыты до утверждения коммерческих правил, состава услуги, ограничений и допущений расчёта.',
    canonicalPath: '/tarify/',
  }, await getRequiredSiteSettings())
}

const tariffItems = getProofEvidenceInventory().filter((item) => item.kind === 'tariff')

export default function TariffsPage() {
  return (
    <main>
      <Section spacing="hero" className="bg-surface-dark text-surface-dark-foreground">
        <Container>
          <div className="max-w-4xl">
            <p className="mb-5 text-label font-bold uppercase text-surface-dark-faint">Коммерческий контур</p>
            <h1 className="font-display text-display font-extrabold">Тарифы Импульс</h1>
            <p className="mt-7 text-body-lg text-surface-dark-muted">
              Публичные тарифы не публикуются до утверждения коммерческих правил. Сейчас страница
              фиксирует структуру будущих условий: состав, ограничения, допущения и персональный расчёт.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="xl">
                <Link href="/#lead-form">Получить персональный расчёт</Link>
              </Button>
              <Button asChild variant="outlineDark" size="xl">
                <Link href="/raschety/">Как считаются допущения</Link>
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="bg-background">
        <Container>
          <SectionHeader
            eyebrow="Правила расчёта"
            title="Цена не раскрывается без утверждённых правил"
            lead="Для каждого продукта нужен подтверждённый состав услуги, единица расчёта, ограничения и список того, что считается индивидуально."
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {tariffItems.map((item) => (
              <Card asChild key={item.id}>
                <article>
                  <CardHeader>
                    <p className="text-label font-bold uppercase text-primary">Готовится</p>
                    <CardTitle asChild><h2>{item.title}</h2></CardTitle>
                    <CardDescription asChild><p>{item.hiddenReason}</p></CardDescription>
                  </CardHeader>
                  <CardContent>
                    <dl className="grid gap-3 text-caption text-muted-foreground">
                      <div>
                        <dt className="font-bold text-foreground">Статус</dt>
                        <dd>скрыто до утверждения условий</dd>
                      </div>
                      <div>
                        <dt className="font-bold text-foreground">Что требуется</dt>
                        <dd>состав услуги, ограничения и порядок расчёта</dd>
                      </div>
                    </dl>
                  </CardContent>
                </article>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
    </main>
  )
}
