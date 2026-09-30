import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import ReviewsPage, { metadata as reviewsMetadata } from '@/app/otzyvy/page'
import { proofEvidenceInventory } from '@/project/proof-inventory'
import { staticRouteSkeletons } from '@/project/route-skeletons'

describe('reviews permission page', () => {
  it('keeps reviews hub noindex and hides reviews without source and permission', () => {
    const html = renderToStaticMarkup(<ReviewsPage />)
    const reviewItems = proofEvidenceInventory.filter((item) => item.kind === 'review')

    expect(reviewsMetadata.alternates?.canonical).toBe('https://ams24.ru/otzyvy/')
    expect(reviewsMetadata.robots).toMatchObject({ index: false, follow: true })
    expect(staticRouteSkeletons.some((route) => route.path === '/otzyvy/')).toBe(false)
    expect(html.match(/<h1\b/g)).toHaveLength(1)
    expect(html).toContain('Требования к отзывам')
    expect(html).toContain('источник, идентификация или обезличивание и разрешение на публикацию')

    for (const item of reviewItems) {
      expect(html).toContain(item.title)
      expect(html).toContain(item.releaseMinimumSlot)
      expect(html).toContain('Статус')
      expect(html).toContain('скрыто до подтверждения')
      expect(html).toContain('Разрешение')
    }
  })

  it('keeps reviews separate from case evidence and metrics', () => {
    const html = renderToStaticMarkup(<ReviewsPage />)

    expect(html).toContain('Отзыв не заменяет кейс')
    expect(html).not.toMatch(/метрики подтверждены|методика расчёта подтверждена|рост на \d+/i)
  })
})
