import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import PixelProductPage, { generateMetadata } from '@/app/pixel/page'
import { staticRouteSkeletons } from '@/core/content/services/route-skeletons'

describe('/pixel/ product page', () => {
  it('has own-site visitor SEO metadata and is no longer an unfinished skeleton', async () => {
    const metadata = await generateMetadata()
    expect(metadata.title).toBe('Импульс Пиксель — идентификация посетителей сайта')
    expect(metadata.description).toContain('заинтересованных посетителей')
    expect(metadata.alternates?.canonical).toBe('https://ams24.ru/pixel/')
    expect(metadata.openGraph?.url).toBe('https://ams24.ru/pixel/')
    expect(metadata.openGraph?.siteName).toBe('Импульс')
    expect(metadata.robots).toMatchObject({ index: true, follow: true })
    expect(staticRouteSkeletons.some((route) => route.path === '/pixel/')).toBe(false)
  })

  it('makes requirements, data boundary and CTA explicit', async () => {
    const html = renderToStaticMarkup(await PixelProductPage())

    expect(html.match(/<h1\b/g)).toHaveLength(1)
    expect(html).toContain('Импульс Пиксель — определить заинтересованных посетителей сайта')
    expect(html).toContain('href="#applicability"')
    expect(html).toContain('Проверить применимость')
    expect(html).toContain('Граница данных')
    expect(html).toContain('Приватность учитывается до обращения')
    expect(html).toContain('Проверено по утверждённым материалам проекта.')
    expect(html).not.toContain('Route skeleton')
    expect(html).not.toContain('Публикационный контроль')
  })

  it('does not imply unsafe visitor identification or privacy bypass', async () => {
    const html = renderToStaticMarkup(await PixelProductPage())

    expect(html).toContain('aria-label="Краткая карточка продукта Импульс Пиксель"')
    expect(html).toContain('aria-label="Контекст будущей заявки на пиксель"')
    expect(html).toContain('sm:grid-cols')
    expect(html).toContain('lg:grid-cols')
    expect(html).not.toMatch(/каждого посетителя|обход(?:ить)? соглас|без соглас/i)
  })
})
