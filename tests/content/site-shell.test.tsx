import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { getNavigationViewModel } from '@/core/content/services/view-models'
import { Breadcrumbs } from '@/ui/shell/breadcrumbs'
import { SiteFooter } from '@/ui/shell/site-footer'
import { SiteHeader } from '@/ui/shell/site-header'

describe('site shell navigation', () => {
  it('exposes all first-level product and content routes in keyboard reachable shell paths', async () => {
    const { firstLevelRoutes, footerGroups, headerLinks, primaryCta, productLinks } = await getNavigationViewModel()
    const header = renderToStaticMarkup(await SiteHeader())
    const footer = renderToStaticMarkup(await SiteFooter())
    const shell = `${header}${footer}`

    expect(header).toContain('aria-label="Основная навигация"')
    expect(header).toContain('aria-label="Мобильная навигация"')
    expect(header).toContain('<summary')
    expect(header).toContain('aria-expanded="false"')
    expect(footer).toContain('aria-label="Навигация в подвале"')
    expect(header.match(/data-slot="button"/g)).toHaveLength(2)
    expect(footer.match(/data-slot="button"/g)).toHaveLength(1)
    expect(header).toMatch(new RegExp(`data-size="xl"[^>]+href="${primaryCta.path}"`))
    expect(footer).toMatch(new RegExp(`data-size="xl"[^>]+href="${primaryCta.path}"`))

    for (const route of firstLevelRoutes) {
      const standaloneRenderPath = route.path === '/' ? '/' : route.path.replace(/\/$/, '')
      expect(shell).toContain(`href="${standaloneRenderPath}"`)
    }

    for (const link of [...productLinks, ...headerLinks]) {
      const standaloneRenderPath = link.path === '/' ? '/' : link.path.replace(/\/$/, '')
      expect(header).toContain(`href="${standaloneRenderPath}"`)
    }

    for (const group of footerGroups) {
      expect(footer).toContain(group.title)
    }
  })

  it('keeps mobile menu behavior in a minimal client leaf and uses Next links throughout the header', async () => {
    const headerSource = await readFile(path.join(process.cwd(), 'src/ui/shell/site-header.tsx'), 'utf8')
    const mobileMenuSource = await readFile(path.join(process.cwd(), 'src/ui/shell/mobile-menu.tsx'), 'utf8')

    expect(headerSource).not.toMatch(/<a\b/)
    expect(mobileMenuSource).not.toMatch(/<a\b/)
    expect(mobileMenuSource).toContain("event.key === 'Escape'")
    expect(mobileMenuSource).toContain("document.addEventListener('pointerdown'")
    expect(mobileMenuSource).toContain('onClick={close}')
    expect(mobileMenuSource).toContain('aria-expanded={open}')
    expect(`${headerSource}${mobileMenuSource}`).toContain('[&::-webkit-details-marker]:hidden')
  })

  it('renders breadcrumbs with aria-current on the current page', () => {
    const html = renderToStaticMarkup(
      <Breadcrumbs items={[{ label: 'Кейсы', path: '/keisy/' }, { label: 'Медицинская ниша', path: '/keisy/med/' }]} />,
    )

    expect(html).toContain('aria-label="Хлебные крошки"')
    expect(html).toContain('href="/"')
    expect(html).toContain('href="/keisy"')
    expect(html).toContain('aria-current="page"')
    expect(html).toMatch(/<nav[^>]*><div class="mx-auto w-full px-5 sm:px-6 max-w-site"><ol/)

    const orderedListClass = html.match(/<ol class="([^"]+)"/)?.[1]
    expect(orderedListClass).toBe('flex flex-wrap items-center gap-2 py-3 text-body-sm text-muted-foreground')
  })
})
