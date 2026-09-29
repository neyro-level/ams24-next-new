import type { DetailFixture } from '@/project/detail-fixtures'
import { Breadcrumbs } from '@/ui/shell/breadcrumbs'
import { Container } from '@/ui/shared/container'
import { Section } from '@/ui/shared/section'

export function DetailFixturePage({ fixture }: { fixture: DetailFixture }) {
  return (
    <main>
      <Breadcrumbs items={fixture.breadcrumbs} />
      <Section spacing="lg" className="bg-surface">
        <Container size="narrow">
          <p className="text-label font-bold uppercase text-primary">{fixture.eyebrow}</p>
          <h1 className="mt-5 font-display text-h1 font-extrabold">{fixture.title}</h1>
          <p className="mt-6 text-body-lg text-muted-foreground">{fixture.summary}</p>

          <div className="mt-10 grid gap-4">
            {['Задача', 'Метод', 'Ограничения', 'Следующий шаг'].map((title) => (
              <section className="rounded-card border border-border bg-surface-elevated p-5" key={title}>
                <h2 className="font-display text-h3 font-bold">{title}</h2>
                <p className="mt-3 text-body text-muted-foreground">
                  Этот блок является skeleton-fixture и будет заменён утверждённым содержанием в
                  соответствующих content эпиках.
                </p>
              </section>
            ))}
          </div>

          <nav aria-label="Связанные маршруты" className="mt-10 rounded-card border border-border bg-surface-muted p-5">
            <p className="text-label font-bold uppercase text-primary">Связанные маршруты</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {fixture.related.map((link) => (
                <a className="rounded-lg border border-border bg-surface-elevated px-3 py-2 text-body-sm font-medium" href={link.path} key={link.path}>
                  {link.label}
                </a>
              ))}
            </div>
          </nav>
        </Container>
      </Section>
    </main>
  )
}
