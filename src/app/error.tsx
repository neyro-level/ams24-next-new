'use client'

import Link from 'next/link'

import { Container } from '@/ui/shared/container'
import { Section } from '@/ui/shared/section'

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main>
      <Section spacing="lg" className="bg-surface">
        <Container size="narrow">
          <p className="text-label font-bold uppercase text-primary">Ошибка страницы</p>
          <h1 className="mt-5 font-display text-h1 font-extrabold">Не удалось открыть раздел</h1>
          <p className="mt-5 text-body-lg text-muted-foreground">
            Попробуйте обновить блок или перейти в рабочий маршрут сайта.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button className="rounded-lg bg-primary px-4 py-3 text-body-sm font-semibold text-primary-foreground" onClick={reset} type="button">
              Повторить
            </button>
            <Link className="rounded-lg border border-border bg-surface-elevated px-4 py-3 text-body-sm font-semibold" href="/">
              На главную
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
