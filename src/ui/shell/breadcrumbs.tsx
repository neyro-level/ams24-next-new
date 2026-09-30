import Link from 'next/link'

import type { NavigationLinkViewModel } from '@/core/content/services/view-models'

type BreadcrumbsProps = {
  items?: NavigationLinkViewModel[]
}

export function Breadcrumbs({ items = [] }: BreadcrumbsProps) {
  if (items.length === 0) {
    return null
  }

  return (
    <nav aria-label="Хлебные крошки" className="border-b border-border bg-surface">
      <ol className="mx-auto flex max-w-site flex-wrap items-center gap-2 px-5 py-3 text-body-sm text-muted-foreground sm:px-6">
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
                <a className="transition hover:text-foreground" href={item.path}>
                  {item.label}
                </a>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
