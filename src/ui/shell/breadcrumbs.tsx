import Link from 'next/link'

import type { NavigationLinkViewModel } from '@/core/content/services/view-models'
import { Container } from '@/ui/shared/container'

type BreadcrumbsProps = {
  items?: NavigationLinkViewModel[]
}

export function Breadcrumbs({ items = [] }: BreadcrumbsProps) {
  if (items.length === 0) {
    return null
  }

  return (
    <nav aria-label="Хлебные крошки" className="border-b border-border bg-surface">
      <Container>
        <ol className="flex flex-wrap items-center gap-2 py-3 text-body-sm text-muted-foreground">
          <li>
            <Link className="transition hover:text-foreground" href="/">
              Главная
            </Link>
          </li>
          {items.map((item, index) => {
            const isLast = index === items.length - 1

            return (
              <li className="flex items-center gap-2" key={item.path}>
                <span aria-hidden="true">/</span>
                {isLast ? (
                  <span aria-current="page" className="text-foreground">
                    {item.label}
                  </span>
                ) : (
                  <Link className="transition hover:text-foreground" href={item.path}>
                    {item.label}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </Container>
    </nav>
  )
}
