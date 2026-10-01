import Link from 'next/link'

import { getNavigationViewModel } from '@/core/content/services/view-models'
import { Button } from '@/ui/primitives/button'
import { Container } from '@/ui/shared/container'

export async function SiteFooter() {
  const { footerGroups, primaryCta } = await getNavigationViewModel()

  return (
    <footer className="bg-surface-dark text-surface-dark-foreground">
      <Container className="py-section-sm">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.4fr]">
          <div>
            <Link className="font-display text-h2 font-extrabold" href="/">
              Импульс
            </Link>
            <p className="mt-5 max-w-md text-body text-surface-dark-muted">
              Платформа AMS24 для привлечения, определения и защиты лидов. Публичный сайт
              собирается как статический Next export.
            </p>
            <Button asChild className="mt-7" size="xl">
              <Link href={primaryCta.path}>{primaryCta.label}</Link>
            </Button>
          </div>

          <nav aria-label="Навигация в подвале" className="grid gap-7 sm:grid-cols-2 lg:grid-cols-5">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <p className="text-label font-bold uppercase text-surface-dark-faint">{group.title}</p>
                <ul className="mt-4 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.path}>
                      <Link className="text-body-sm text-surface-dark-muted transition hover:text-surface-dark-foreground" href={link.path}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </Container>
    </footer>
  )
}
