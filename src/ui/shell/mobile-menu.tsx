'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'

import { Button } from '@/ui/primitives/button'

type NavigationLink = {
  label: string
  path: string
}

type MobileMenuProps = {
  headerLinks: NavigationLink[]
  primaryCta: NavigationLink
  productLinks: NavigationLink[]
}

export function MobileMenu({ headerLinks, primaryCta, productLinks }: MobileMenuProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null)
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (event.target instanceof Node && !detailsRef.current?.contains(event.target)) close()
    }

    document.addEventListener('keydown', closeOnEscape)
    document.addEventListener('pointerdown', closeOnOutsideClick)

    return () => {
      document.removeEventListener('keydown', closeOnEscape)
      document.removeEventListener('pointerdown', closeOnOutsideClick)
    }
  }, [close, open])

  return (
    <details
      className="group lg:hidden"
      onToggle={(event) => setOpen(event.currentTarget.open)}
      open={open}
      ref={detailsRef}
    >
      <summary
        aria-expanded={open}
        className="cursor-pointer list-none rounded-lg border border-border px-3 py-2 text-body-sm font-semibold outline-none focus-visible:ring-3 focus-visible:ring-ring/40 [&::-webkit-details-marker]:hidden"
      >
        Меню
      </summary>
      <div className="absolute inset-x-4 top-16 z-30 rounded-card border border-border bg-surface-elevated p-3 shadow-card">
        <nav aria-label="Мобильная навигация" className="grid gap-1">
          <p className="px-3 py-2 text-label font-bold uppercase text-primary">Продукты</p>
          {productLinks.map((link) => (
            <Link
              className="rounded-lg px-3 py-2 text-body-sm transition hover:bg-surface-muted"
              href={link.path}
              key={link.path}
              onClick={close}
            >
              {link.label}
            </Link>
          ))}
          <p className="mt-2 px-3 py-2 text-label font-bold uppercase text-primary">Разделы</p>
          {headerLinks.map((link) => (
            <Link
              className="rounded-lg px-3 py-2 text-body-sm transition hover:bg-surface-muted"
              href={link.path}
              key={link.path}
              onClick={close}
            >
              {link.label}
            </Link>
          ))}
          <Button asChild className="mt-2" size="xl">
            <Link href={primaryCta.path} onClick={close}>
              {primaryCta.label}
            </Link>
          </Button>
        </nav>
      </div>
    </details>
  )
}
