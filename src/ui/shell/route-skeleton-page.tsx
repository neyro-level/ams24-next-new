import type { RouteSkeleton } from '@/core/content/services/route-skeletons'
import { Container } from '@/ui/shared/container'
import { Section } from '@/ui/shared/section'

export function RouteSkeletonPage({ route }: { route: RouteSkeleton }) {
  return (
    <main>
      <Section spacing="lg" className="bg-surface">
        <Container size="narrow">
          <p className="text-label font-bold uppercase text-primary">Страница готовится</p>
          <h1 className="mt-5 font-display text-h1 font-extrabold">{route.title}</h1>
          <p className="mt-6 text-body-lg text-muted-foreground">{route.intent}</p>
          <div className="mt-8 rounded-card border border-border bg-surface-elevated p-5">
            <p className="text-label font-bold uppercase text-primary">Назначение раздела</p>
            <p className="mt-3 text-body">{route.role}</p>
          </div>
          <div className="mt-5 rounded-card border border-border bg-surface-muted p-5">
            <p className="text-label font-bold uppercase text-primary">Что появится здесь</p>
            <p className="mt-3 text-body text-muted-foreground">
              Страница доступна как будущий раздел, но закрыта от индексации до наполнения
              уникальным утверждённым содержанием.
            </p>
            <p className="mt-4 text-body-sm text-muted-foreground">{route.nextStep}</p>
          </div>
        </Container>
      </Section>
    </main>
  )
}
