import type { LegalPageDTO } from '@/core/content/services/legal-pages'
import { Container } from '@/ui/shared/container'
import { Section } from '@/ui/shared/section'
import { SectionHeader } from '@/ui/shared/section-header'

export function LegalPage({ page }: { page: LegalPageDTO }) {
  return (
    <main>
      <Section spacing="hero" className="bg-surface-dark text-surface-dark-foreground">
        <Container>
          <SectionHeader
            eyebrow="Документы"
            title={page.h1}
            level={1}
            tone="dark"
            lead="Документ проходит юридическое согласование. До утверждения форма не принимает и не передаёт персональные данные."
          />
        </Container>
      </Section>

      <Section className="bg-background">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <aside className="rounded-large border border-border bg-surface-elevated p-6 shadow-card">
              <p className="text-label font-bold uppercase text-primary">Текущий статус</p>
              <dl className="mt-5 space-y-4 text-body-sm text-muted-foreground">
                <div>
                  <dt className="font-semibold text-foreground">Статус</dt>
                  <dd className="mt-1">Документ согласуется и пока не применяется к отправке заявок.</dd>
                </div>
              </dl>
            </aside>

            <div className="rounded-large border border-border bg-surface p-6">
              <p className="text-label font-bold uppercase text-primary">Почему форма отключена</p>
              <h2 className="mt-5 font-display text-h2 font-extrabold">Сначала — утверждённые правила</h2>
              <p className="mt-5 text-body text-muted-foreground">{page.intent}.</p>
              <p className="mt-6 rounded-card border border-dashed border-border bg-surface-elevated p-4 text-body-sm text-muted-foreground">
                Пока юридический текст не утверждён, формы остаются выключены и не передают данные.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  )
}
