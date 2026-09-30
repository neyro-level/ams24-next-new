import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import HomePage, { metadata as homeMetadata } from '@/app/page'
import ImpulsProductPage, { metadata as impulsMetadata } from '@/app/impuls/page'
import PixelProductPage, { metadata as pixelMetadata } from '@/app/pixel/page'
import ZashchitaProductPage, { metadata as zashchitaMetadata } from '@/app/zashchita/page'
import { localContent } from '@/project/content/local-content'

const productPages = [
  {
    id: 'impuls',
    path: '/impuls/',
    html: () => renderToStaticMarkup(<ImpulsProductPage />),
    metadata: impulsMetadata,
    expectedCta: 'Рассчитать запуск',
    uniqueIntentMarker: 'лидогенерация для бизнеса',
  },
  {
    id: 'pixel',
    path: '/pixel/',
    html: () => renderToStaticMarkup(<PixelProductPage />),
    metadata: pixelMetadata,
    expectedCta: 'Проверить применимость',
    uniqueIntentMarker: 'заинтересованных посетителей сайта',
  },
  {
    id: 'zashchita',
    path: '/zashchita/',
    html: () => renderToStaticMarkup(<ZashchitaProductPage />),
    metadata: zashchitaMetadata,
    expectedCta: 'Провести аудит',
    uniqueIntentMarker: 'аудит риска перехвата лидов',
  },
] as const

function normalizeText(value: string) {
  return value
    .replace(/<[^>]+>/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function paragraphTexts(html: string) {
  return [...html.matchAll(/<p\b[^>]*>(.*?)<\/p>/gs)]
    .map((match) => normalizeText(match[1]))
    .filter((text) => text.length >= 70)
}

describe('homepage and product intent review', () => {
  it('keeps homepage as a route selector and product pages as distinct intent landings', () => {
    const homeHtml = renderToStaticMarkup(<HomePage />)
    const homePage = localContent.pages.find((page) => page.path === '/')

    expect(homePage?.role).toBe('платформа и маршрутизация')
    expect(homePage?.intent).toContain('выбрать подходящий маршрут')
    expect(homeMetadata.alternates?.canonical).toBe('https://ams24.ru/')
    expect(homeMetadata.openGraph?.url).toBe('https://ams24.ru/')
    expect(homeMetadata.openGraph?.siteName).toBe('Импульс')
    expect(homeHtml).toContain('Главная не дублирует продуктовые страницы')
    expect(homeHtml).toContain('href="#lead-form"')
    expect(homeHtml).toContain('href="#products"')
    expect(homeHtml).not.toContain('href="#calculation"')
    expect(homeHtml).not.toContain('href="#applicability"')
    expect(homeHtml).not.toContain('href="#audit"')

    for (const page of productPages) {
      const html = page.html()

      expect(homeHtml).toContain(`href="${page.path}"`)
      expect(html).toContain(page.expectedCta)
      expect(html).toContain(page.uniqueIntentMarker)
      expect(html).not.toContain('Главная не дублирует продуктовые страницы')
      expect(html).not.toContain('href="#products"')
      expect(html).not.toContain('Три маршрута')
      expect(page.metadata.alternates?.canonical).toBe(new URL(page.path, 'https://ams24.ru').toString())
      expect(page.metadata.robots).toMatchObject({ index: true, follow: true })
    }
  })

  it('has no paragraph-level duplicate between homepage and any product page', () => {
    const homeParagraphs = new Set(paragraphTexts(renderToStaticMarkup(<HomePage />)))

    for (const page of productPages) {
      const duplicates = paragraphTexts(page.html()).filter((text) => homeParagraphs.has(text))

      expect(duplicates, `${page.path} duplicates homepage paragraphs`).toEqual([])
    }
  })

  it('keeps product SEO titles, canonical routes and CTA labels unique', () => {
    const titles = new Set(productPages.map((page) => page.metadata.title))
    const canonicalRoutes = new Set(productPages.map((page) => page.metadata.alternates?.canonical))
    const ctas = new Set(productPages.map((page) => page.expectedCta))

    expect(titles.size).toBe(productPages.length)
    expect(canonicalRoutes).toEqual(
      new Set(['https://ams24.ru/impuls/', 'https://ams24.ru/pixel/', 'https://ams24.ru/zashchita/']),
    )
    expect(ctas).toEqual(new Set(['Рассчитать запуск', 'Проверить применимость', 'Провести аудит']))
  })
})
