import Link from 'next/link'

import { Container } from '@/ui/shared/container'
import { Section } from '@/ui/shared/section'

export default function NotFound() {
  return (
    <main>
      <Section spacing="lg" className="bg-surface">
        <Container size="narrow">
          <p className="text-label font-bold uppercase text-primary">404</p>
          <h1 className="mt-5 font-display text-h1 font-extrabold">Страница не найдена</h1>
          <p className="mt-5 text-body-lg text-muted-foreground">
            Адрес ещё не опубликован, был изменён или относится к материалу, который пока скрыт
            до подтверждения.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="rounded-lg bg-primary px-4 py-3 text-body-sm font-semibold text-primary-foreground" href="/">
              На главную
            </Link>
            <Link className="rounded-lg border border-border bg-surface-elevated px-4 py-3 text-body-sm font-semibold" href="/#products">
              Выбрать продукт
            </Link>
            <a className="rounded-lg border border-border bg-surface-elevated px-4 py-3 text-body-sm font-semibold" href="/kontakty/">
              Контакты
            </a>
          </div>
        </Container>
      </Section>
    </main>
  )
}
