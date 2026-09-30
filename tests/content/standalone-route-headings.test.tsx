import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import ContactsPage from '@/app/kontakty/page'
import { getStaticRouteSkeleton } from '@/project/route-skeletons'
import { LegalPage } from '@/ui/legal/legal-page'
import { RouteSkeletonPage } from '@/ui/shell/route-skeleton-page'

const count = (html: string, pattern: RegExp) => html.match(pattern)?.length ?? 0

describe('standalone/legal/contact route headings', () => {
  it.each([
    ['contacts', renderToStaticMarkup(<ContactsPage />), 'Оставьте задачу для расчёта'],
    ['legal policy', renderToStaticMarkup(<LegalPage kind="policy" />), 'Политика обработки данных'],
    ['legal consent', renderToStaticMarkup(<LegalPage kind="consent" />), 'Согласие на обработку данных'],
    ['legal data processing', renderToStaticMarkup(<LegalPage kind="data-processing" />), 'Обработка данных'],
    [
      'company skeleton',
      renderToStaticMarkup(<RouteSkeletonPage route={getStaticRouteSkeleton('/o-kompanii/')} />),
      'О компании',
    ],
    [
      'requisites skeleton',
      renderToStaticMarkup(<RouteSkeletonPage route={getStaticRouteSkeleton('/rekvizity/')} />),
      'Реквизиты',
    ],
  ])('%s has one h1 and no accidental dark utility drift', (_name, html, h1Text) => {
    expect(count(html, /<h1\b/g)).toBe(1)
    expect(html).toContain(`<h1`)
    expect(html).toContain(h1Text)
    expect(html).not.toContain('bg-black')
    expect(html).not.toContain('text-white')
  })

  it.each([
    ['contacts', renderToStaticMarkup(<ContactsPage />)],
    ['legal policy', renderToStaticMarkup(<LegalPage kind="policy" />)],
  ])('%s keeps intentional dark hero tone and light body tone', (_name, html) => {
    expect(html).toContain('bg-surface-dark')
    expect(html).toContain('text-surface-dark-foreground')
    expect(html).toContain('bg-background')
  })
})
