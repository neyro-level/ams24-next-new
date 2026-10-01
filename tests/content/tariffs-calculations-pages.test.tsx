import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import CalculationsPage, { metadata as calculationsMetadata } from '@/app/raschety/page'
import TariffsPage, { metadata as tariffsMetadata } from '@/app/tarify/page'
import { proofEvidenceInventory } from '@/project/proof-inventory'
import { staticRouteSkeletons } from '@/core/content/services/route-skeletons'

describe('tariffs and calculations pages', () => {
  it('keeps tariff page noindex and tied to hidden tariff inventory until commercial rules are approved', () => {
    const html = renderToStaticMarkup(<TariffsPage />)
    const tariffItems = proofEvidenceInventory.filter((item) => item.kind === 'tariff')

    expect(tariffsMetadata.alternates?.canonical).toBe('https://ams24.ru/tarify/')
    expect(tariffsMetadata.robots).toMatchObject({ index: false, follow: true })
    expect(staticRouteSkeletons.some((route) => route.path === '/tarify/')).toBe(false)
    expect(html.match(/<h1\b/g)).toHaveLength(1)
    expect(html).toContain('коммерческих правил')
    expect(html).toContain('Цена не раскрывается без утверждённых правил')

    for (const item of tariffItems) {
      expect(html).toContain(item.title)
      expect(html).toContain('Статус')
      expect(html).toContain('скрыто до утверждения условий')
    }

    expect(html).not.toMatch(/(?:₽|руб\.|цена от|стоимость от|\d+\s?(?:000|тыс))/i)
  })

  it('keeps calculation page noindex and exposes assumptions without false precision', () => {
    const html = renderToStaticMarkup(<CalculationsPage />)
    const calculationItems = proofEvidenceInventory.filter((item) => item.kind === 'calculation')

    expect(calculationsMetadata.alternates?.canonical).toBe('https://ams24.ru/raschety/')
    expect(calculationsMetadata.robots).toMatchObject({ index: false, follow: true })
    expect(staticRouteSkeletons.some((route) => route.path === '/raschety/')).toBe(false)
    expect(html.match(/<h1\b/g)).toHaveLength(1)
    expect(html).toContain('Расчёт без ложной точности')
    expect(html).toContain('ниша, регион и сезонность спроса')
    expect(html).toContain('юридические ограничения, согласия и способ передачи результата')

    for (const item of calculationItems) {
      expect(html).toContain(item.title)
      expect(html).toContain('Статус: скрыто до утверждения коммерческих правил и ограничений.')
    }

    expect(html).not.toMatch(/(?:₽|руб\.|цена от|стоимость от|\d+\s?(?:000|тыс))/i)
  })
})
