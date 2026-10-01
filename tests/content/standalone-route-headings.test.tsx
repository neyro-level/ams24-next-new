import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import ContactsPage from '@/app/kontakty/page'
import { getLegalPage } from '@/core/content/services/legal-pages'
import { getStaticRouteSkeleton } from '@/core/content/services/route-skeletons'
import { LegalPage } from '@/ui/legal/legal-page'
import { RouteSkeletonPage } from '@/ui/shell/route-skeleton-page'

const count = (html: string, pattern: RegExp) => html.match(pattern)?.length ?? 0
const forbiddenToneUtilities = ['bg-black', 'text-white']

function assertOneH1(html: string) {
  expect(count(html, /<h1\b/g)).toBe(1)
}

function assertNoToneDrift(html: string) {
  for (const utility of forbiddenToneUtilities) {
    expect(html).not.toContain(utility)
  }
}

describe('standalone/legal/contact route headings', () => {
  it.each([
    ['contacts', renderToStaticMarkup(<ContactsPage />), 'Оставьте задачу для расчёта'],
    ['legal policy', renderToStaticMarkup(<LegalPage page={getLegalPage('policy')} />), 'Политика обработки данных'],
    ['legal consent', renderToStaticMarkup(<LegalPage page={getLegalPage('consent')} />), 'Согласие на обработку данных'],
    ['legal data processing', renderToStaticMarkup(<LegalPage page={getLegalPage('data-processing')} />), 'Обработка данных'],
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
    assertOneH1(html)
    expect(html).toContain(`<h1`)
    expect(html).toContain(h1Text)
    assertNoToneDrift(html)
  })

  it.each([
    ['contacts', renderToStaticMarkup(<ContactsPage />)],
    ['legal policy', renderToStaticMarkup(<LegalPage page={getLegalPage('policy')} />)],
  ])('%s keeps intentional dark hero tone and light body tone', (_name, html) => {
    expect(html).toContain('bg-surface-dark')
    expect(html).toContain('text-surface-dark-foreground')
    expect(html).toContain('bg-background')
  })

  it('fails negative heading hierarchy fixtures', () => {
    expect(() => assertOneH1('<main><h1>One</h1><h1>Two</h1></main>')).toThrow()
    expect(() => assertOneH1('<main><h2>No page title</h2></main>')).toThrow()
  })

  it('fails negative tone drift fixture', () => {
    expect(() => assertNoToneDrift('<main class="bg-black text-white"><h1>Unsafe tone</h1></main>')).toThrow()
  })
})
