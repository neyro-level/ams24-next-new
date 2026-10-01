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
    title: 'Отзывы Импульс — материалы готовятся',
    description:
      'Отзывы Импульс остаются скрыты до подтверждения источника, идентификации или обезличивания и разрешения на публикацию.',
    canonicalPath: '/otzyvy/',
  }, await getRequiredSiteSettings())
}

const reviewItems = getProofEvidenceInventory().filter((item) => item.kind === 'review')

export default function ReviewsPage() {
  return (
    <main>
      <Section spacing="hero" className="bg-surface-dark text-surface-dark-foreground">
        <Container>
          <div className="max-w-4xl">
            <p className="mb-5 text-label font-bold uppercase text-surface-dark-faint">Отзывы</p>
            <h1 className="font-display text-display font-extrabold">Отзывы Импульс</h1>
            <p className="mt-7 text-body-lg text-surface-dark-muted">
              Отзывы будут опубликованы только после проверки источника, способа идентификации или
              обезличивания и разрешения на публикацию. Отзыв не заменяет кейс и не доказывает метрики.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="xl">
                <Link href="/#lead-form">Обсудить задачу</Link>
              </Button>
              <Button asChild variant="outlineDark" size="xl">
                <Link href="/keisy/">Как проверяются кейсы</Link>
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="bg-background">
        <Container>
          <SectionHeader
            eyebrow="Требования к отзывам"
            title="Отзывы скрыты до подтверждения источника"
            lead="Пока нет источника, прозрачного обезличивания или идентификации и разрешения, отзыв не становится публичным доказательством."
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {reviewItems.map((item) => (
              <Card asChild key={item.id}>
                <article>
                  <CardHeader>
                    <p className="text-label font-bold uppercase text-primary">{item.releaseMinimumSlot}</p>
                    <CardTitle asChild><h3>{item.title}</h3></CardTitle>
                    <CardDescription asChild><p>{item.hiddenReason}</p></CardDescription>
                  </CardHeader>
                  <CardContent>
                    <dl className="grid gap-3 text-caption text-muted-foreground">
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
                        <dd>источник, идентификация или обезличивание и разрешение на публикацию</dd>
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
