import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import PixelProductPage, { metadata } from '@/app/pixel/page'
import { staticRouteSkeletons } from '@/project/route-skeletons'

describe('/pixel/ product page', () => {
  it('has own-site visitor SEO metadata and is no longer an unfinished skeleton', () => {
    expect(metadata.title).toBe('Импульс Пиксель — идентификация посетителей сайта')
    expect(metadata.description).toContain('заинтересованных посетителей')
    expect(metadata.alternates?.canonical).toBe('/pixel/')
    expect(metadata.robots).toMatchObject({ index: true, follow: true })
    expect(staticRouteSkeletons.some((route) => route.path === '/pixel/')).toBe(false)
  })

  it('makes requirements, data boundary and CTA explicit', () => {
    const html = renderToStaticMarkup(<PixelProductPage />)

    expect(html.match(/<h1\b/g)).toHaveLength(1)
    expect(html).toContain('Импульс Пиксель — определить заинтересованных посетителей сайта')
    expect(html).toContain('href="#applicability"')
    expect(html).toContain('Проверить применимость')
    expect(html).toContain('Data boundary')
    expect(html).toContain('Privacy ambiguity закрыта до CTA')
    expect(html).toContain('legal-review:OD-03')
    expect(html).not.toContain('Route skeleton')
    expect(html).not.toContain('Publication guard')
  })

  it('does not imply unsafe visitor identification or privacy bypass', () => {
    const html = renderToStaticMarkup(<PixelProductPage />)

    expect(html).toContain('aria-label="Краткая карточка продукта Импульс Пиксель"')
    expect(html).toContain('aria-label="Контекст будущей заявки на пиксель"')
    expect(html).toContain('sm:grid-cols')
    expect(html).toContain('lg:grid-cols')
    expect(html).not.toMatch(/каждого посетителя|обход(?:ить)? соглас|без соглас/i)
  })
})
