import Link from 'next/link'

import { footerGroups, primaryCta } from '@/project/navigation'
import { Container } from '@/ui/shared/container'

export function SiteFooter() {
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
            <a className="mt-7 inline-flex rounded-lg bg-primary px-4 py-3 text-body-sm font-semibold text-primary-foreground" href={primaryCta.path}>
              {primaryCta.label}
            </a>
          </div>

          <nav aria-label="Навигация в подвале" className="grid gap-7 sm:grid-cols-2 lg:grid-cols-5">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <p className="text-label font-bold uppercase text-surface-dark-faint">{group.title}</p>
                <ul className="mt-4 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.path}>
                      <a className="text-body-sm text-surface-dark-muted transition hover:text-surface-dark-foreground" href={link.path}>
                        {link.label}
                      </a>
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
