import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import ImpulsProductPage, { metadata } from '@/app/impuls/page'
import { staticRouteSkeletons } from '@/project/route-skeletons'

describe('/impuls/ product page', () => {
  it('has unique indexable SEO metadata and is no longer an unfinished skeleton', () => {
    expect(metadata.title).toBe('Импульс — лидогенерация для бизнеса через целевые аудитории')
    expect(metadata.description).toContain('применимость')
    expect(metadata.alternates?.canonical).toBe('/impuls/')
    expect(metadata.robots).toMatchObject({ index: true, follow: true })
    expect(staticRouteSkeletons.some((route) => route.path === '/impuls/')).toBe(false)
  })

  it('answers the main commercial intent with one H1, CTA and claim boundaries', () => {
    const html = renderToStaticMarkup(<ImpulsProductPage />)

    expect(html.match(/<h1\b/g)).toHaveLength(1)
    expect(html).toContain('Импульс — лидогенерация для бизнеса')
    expect(html).toContain('href="#calculation"')
    expect(html).toContain('Рассчитать запуск')
    expect(html).toContain('Claim guard')
    expect(html).toContain('legal-review:OD-03')
    expect(html).not.toContain('Route skeleton')
    expect(html).not.toContain('Publication guard')
    expect(html).not.toContain('Платформа маркетинговых продуктов, которая помогает привлекать')
  })

  it('keeps responsive and accessibility markers measurable', () => {
    const html = renderToStaticMarkup(<ImpulsProductPage />)

    expect(html).toContain('aria-label="Краткая карточка продукта Импульс"')
    expect(html).toContain('aria-label="Форма расчёта"')
    expect(html).toContain('data-product="impuls"')
    expect(html).toContain('sm:grid-cols')
    expect(html).toContain('lg:grid-cols')
    expect(html.match(/disabled=""/g)?.length ?? 0).toBeGreaterThanOrEqual(1)
    expect(html).not.toMatch(/гарантируем|абсолютная защита|фиксированн(?:ый|ое) рост/i)
  })
})
