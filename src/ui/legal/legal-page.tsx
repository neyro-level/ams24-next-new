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
            eyebrow="Юридическая страница"
            title={page.h1}
            level={1}
            tone="dark"
            lead="Это не финальный юридический текст. Страница создана как безопасная цель для ссылок согласия и будет наполнена после юридического согласования."
          />
        </Container>
      </Section>

      <Section className="bg-background">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <aside className="rounded-large border border-border bg-surface-elevated p-6 shadow-card">
              <p className="text-label font-bold uppercase text-primary">Версия</p>
              <dl className="mt-5 space-y-4 text-body-sm text-muted-foreground">
                <div>
                  <dt className="font-semibold text-foreground">Статус</dt>
                  <dd className="mt-1">черновик, скрыт от индексации, ждёт согласования</dd>
                </div>
                <div>
                  <dt className="font-semibold text-foreground">Версия</dt>
                  <dd className="mt-1">{page.version}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-foreground">Адрес</dt>
                  <dd className="mt-1">{page.path}</dd>
                </div>
              </dl>
            </aside>

            <div className="rounded-large border border-border bg-surface p-6">
              <p className="text-label font-bold uppercase text-primary">Назначение страницы</p>
              <h2 className="mt-5 font-display text-h2 font-extrabold">Что уже можно проверять</h2>
              <p className="mt-5 text-body text-muted-foreground">{page.intent}.</p>
              <h3 className="mt-8 font-display text-h3 font-bold">Что нужно до публичного релиза</h3>
              <ul className="mt-4 space-y-3 text-body text-muted-foreground">
                {page.requiredBeforeRelease.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
              <p className="mt-6 rounded-card border border-dashed border-border bg-surface-elevated p-4 text-body-sm text-muted-foreground">
                Пока юридический текст не утверждён, формы остаются выключены, а страница не
                попадает в индексируемую карту сайта.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  )
}
