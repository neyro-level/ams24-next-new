import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import CasesPage from '@/app/keisy/page'
import ImpulsProductPage from '@/app/impuls/page'
import HomePage from '@/app/page'
import CalculationsPage from '@/app/raschety/page'
import ReviewsPage from '@/app/otzyvy/page'
import TariffsPage from '@/app/tarify/page'

describe('public heading hierarchy', () => {
  it('keeps exactly one logical h1 on representative and card-heavy routes', async () => {
    const pages = [
      await HomePage(),
      await ImpulsProductPage(),
      <TariffsPage key="tariffs" />,
      <CalculationsPage key="calculations" />,
      <CasesPage key="cases" />,
      <ReviewsPage key="reviews" />,
    ]

    for (const page of pages) {
      expect(renderToStaticMarkup(page).match(/<h1\b/g)).toHaveLength(1)
    }
  })

  it('uses h3 for card titles independently of their visual class', () => {
    for (const page of [<TariffsPage key="tariffs" />, <CalculationsPage key="calculations" />, <CasesPage key="cases" />, <ReviewsPage key="reviews" />]) {
      const html = renderToStaticMarkup(page)
      expect(html).toContain('<h3 data-slot="card-title"')
      expect(html).not.toContain('<h2 data-slot="card-title"')
    }
  })

  it('nests form and repeated product content below section headings', async () => {
    const home = renderToStaticMarkup(await HomePage())
    const impuls = renderToStaticMarkup(await ImpulsProductPage())

    expect(home).toMatch(/<h2[^>]*>Опишите задачу — подготовим маршрут запуска<\/h2>/)
    expect(home).toMatch(/<h3[^>]*>Опишите задачу — подготовим маршрут запуска<\/h3>/)
    expect(impuls).toMatch(/<h3[^>]*>Разбор задачи<\/h3>/)
    expect(impuls).toMatch(/<h3[^>]*>Можно ли обещать точное количество лидов\?<\/h3>/)
  })
})
