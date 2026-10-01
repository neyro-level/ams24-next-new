'use client'

import Link from 'next/link'

import { Button } from '@/ui/primitives/button'
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
            <Button onClick={reset} size="xl" type="button">
              Повторить
            </Button>
            <Button asChild size="xl" variant="outline">
              <Link href="/">На главную</Link>
            </Button>
            <Button asChild size="xl" variant="outline">
              <Link href="/kontakty/">Контакты</Link>
            </Button>
          </div>
        </Container>
      </Section>
    </main>
  )
}
