import Link from 'next/link'

import { proofEvidenceInventory } from '@/core/content/services/proof-inventory'
import { buildNoindexMetadata } from '@/core/seo'
import { Button } from '@/ui/primitives/button'
import { Container } from '@/ui/shared/container'
import { Section, SectionHeader } from '@/ui/shared/section'

export const metadata = buildNoindexMetadata({
  title: 'Отзывы Импульс — материалы готовятся',
  description:
    'Отзывы Импульс остаются скрыты до подтверждения источника, идентификации или обезличивания и разрешения на публикацию.',
  canonicalPath: '/otzyvy/',
})

const reviewItems = proofEvidenceInventory.filter((item) => item.kind === 'review')

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
              <Button asChild size="lg" className="h-12 px-5">
                <Link href="/#lead-form">Обсудить задачу</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 border-surface-dark-faint bg-transparent px-5 text-surface-dark-foreground hover:bg-surface-dark-hover hover:text-surface-dark-foreground"
              >
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
                    <dd>источник, идентификация или обезличивание и разрешение на публикацию</dd>
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
