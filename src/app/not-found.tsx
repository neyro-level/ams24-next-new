import Link from 'next/link'

import { Button } from '@/ui/primitives/button'
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
            <Button asChild size="xl">
              <Link href="/">На главную</Link>
            </Button>
            <Button asChild size="xl" variant="outline">
              <Link href="/#products">Выбрать продукт</Link>
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
