import Link from 'next/link'

import { getNavigationViewModel } from '@/core/content/services/view-models'
import { Button } from '@/ui/primitives/button'
import { Container } from '@/ui/shared/container'

function ProductMenu({ productLinks }: { productLinks: Awaited<ReturnType<typeof getNavigationViewModel>>['productLinks'] }) {
  return (
    <details className="group relative">
      <summary className="cursor-pointer list-none rounded-lg px-3 py-2 text-body-sm font-medium outline-none transition hover:bg-surface-muted focus-visible:ring-3 focus-visible:ring-ring/40">
        Продукты
      </summary>
      <div className="absolute left-0 top-full z-20 mt-3 w-72 rounded-card border border-border bg-surface-elevated p-2 shadow-card">
        {productLinks.map((link) => (
          <a className="block rounded-lg px-3 py-2 text-body-sm transition hover:bg-surface-muted" href={link.path} key={link.path}>
            {link.label}
          </a>
        ))}
      </div>
    </details>
  )
}

export async function SiteHeader() {
  const { headerLinks, primaryCta, productLinks } = await getNavigationViewModel()

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface-elevated/95 backdrop-blur">
      <Container className="flex min-h-16 items-center justify-between gap-4">
        <Link className="font-display text-h3 font-extrabold" href="/">
          Импульс
        </Link>

        <nav aria-label="Основная навигация" className="hidden items-center gap-1 lg:flex">
          <ProductMenu productLinks={productLinks} />
          {headerLinks.map((link) => (
            <a className="rounded-lg px-3 py-2 text-body-sm font-medium transition hover:bg-surface-muted" href={link.path} key={link.path}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button asChild>
            <Link href={primaryCta.path}>{primaryCta.label}</Link>
          </Button>
        </div>

        <details className="group lg:hidden">
          <summary className="cursor-pointer list-none rounded-lg border border-border px-3 py-2 text-body-sm font-semibold outline-none focus-visible:ring-3 focus-visible:ring-ring/40">
            Меню
          </summary>
          <div className="absolute inset-x-4 top-16 z-30 rounded-card border border-border bg-surface-elevated p-3 shadow-card">
            <nav aria-label="Мобильная навигация" className="grid gap-1">
              <p className="px-3 py-2 text-label font-bold uppercase text-primary">Продукты</p>
              {productLinks.map((link) => (
                <a className="rounded-lg px-3 py-2 text-body-sm transition hover:bg-surface-muted" href={link.path} key={link.path}>
                  {link.label}
                </a>
              ))}
              <p className="mt-2 px-3 py-2 text-label font-bold uppercase text-primary">Разделы</p>
              {headerLinks.map((link) => (
                <a className="rounded-lg px-3 py-2 text-body-sm transition hover:bg-surface-muted" href={link.path} key={link.path}>
                  {link.label}
                </a>
              ))}
              <Button asChild className="mt-2" size="xl">
                <Link href={primaryCta.path}>{primaryCta.label}</Link>
              </Button>
            </nav>
          </div>
        </details>
      </Container>
    </header>
  )
}
