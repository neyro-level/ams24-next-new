import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import ZashchitaProductPage, { generateMetadata } from '@/app/zashchita/page'
import { staticRouteSkeletons } from '@/core/content/services/route-skeletons'

describe('/zashchita/ product page', () => {
  it('has protection-risk SEO metadata and is no longer an unfinished skeleton', async () => {
    const metadata = await generateMetadata()
    expect(metadata.title).toBe('Импульс Защита — аудит риска перехвата лидов')
    expect(metadata.description).toContain('без абсолютных гарантий')
    expect(metadata.alternates?.canonical).toBe('https://ams24.ru/zashchita/')
    expect(metadata.openGraph?.url).toBe('https://ams24.ru/zashchita/')
    expect(metadata.openGraph?.siteName).toBe('Импульс')
    expect(metadata.robots).toMatchObject({ index: true, follow: true })
    expect(staticRouteSkeletons.some((route) => route.path === '/zashchita/')).toBe(false)
  })

  it('explains threat model, limits, evidence and CTA', async () => {
    const html = renderToStaticMarkup(await ZashchitaProductPage())

    expect(html.match(/<h1\b/g)).toHaveLength(1)
    expect(html).toContain('Импульс Защита — аудит риска перехвата лидов')
    expect(html).toContain('Признаки риска')
    expect(html).toContain('Граница обещаний')
    expect(html).toContain('Провести аудит')
    expect(html).toContain('не обещает невозможность перехвата')
    expect(html).toContain('Абсолютных гарантий нет')
    expect(html).not.toContain('Route skeleton')
    expect(html).not.toContain('Публикационный контроль')
  })

  it('keeps absolute guarantee out of the public promise', async () => {
    const html = renderToStaticMarkup(await ZashchitaProductPage())

    expect(html).toContain('aria-label="Краткая карточка продукта Импульс Защита"')
    expect(html).toContain('aria-label="Контекст будущей заявки на аудит защиты"')
    expect(html).toContain('sm:grid-cols')
    expect(html).toContain('lg:grid-cols')
    expect(html).not.toMatch(/гарантируем|абсолютная защита|100%|навсегда защищ/i)
  })
})
