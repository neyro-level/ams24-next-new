import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { firstLevelRoutes, footerGroups, headerLinks, productLinks } from '@/project/navigation'
import { Breadcrumbs } from '@/ui/shell/breadcrumbs'
import { SiteFooter } from '@/ui/shell/site-footer'
import { SiteHeader } from '@/ui/shell/site-header'

describe('site shell navigation', () => {
  it('exposes all first-level product and content routes in keyboard reachable shell paths', () => {
    const header = renderToStaticMarkup(<SiteHeader />)
    const footer = renderToStaticMarkup(<SiteFooter />)
    const shell = `${header}${footer}`

    expect(header).toContain('aria-label="Основная навигация"')
    expect(header).toContain('aria-label="Мобильная навигация"')
    expect(header).toContain('<summary')
    expect(footer).toContain('aria-label="Навигация в подвале"')

    for (const route of firstLevelRoutes) {
      expect(shell).toContain(`href="${route.path}"`)
    }

    for (const link of [...productLinks, ...headerLinks]) {
      expect(header).toContain(`href="${link.path}"`)
    }

    for (const group of footerGroups) {
      expect(footer).toContain(group.title)
    }
  })

  it('renders breadcrumbs with aria-current on the current page', () => {
    const html = renderToStaticMarkup(
      <Breadcrumbs items={[{ label: 'Кейсы', path: '/keisy/' }, { label: 'Медицинская ниша', path: '/keisy/med/' }]} />,
    )

    expect(html).toContain('aria-label="Хлебные крошки"')
    expect(html).toContain('href="/"')
    expect(html).toContain('href="/keisy/"')
    expect(html).toContain('aria-current="page"')
  })
})
