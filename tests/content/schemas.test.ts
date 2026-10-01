import { describe, expect, it } from 'vitest'

import {
  leadIntentSchema,
  pageSchema,
  productSchema,
  type LeadIntentDTO,
  type PageDTO,
  type ProductDTO,
} from '@/core/content/schemas'

const seo = {
  title: 'Импульс — привлечение лидов для бизнеса',
  description: 'Страница продукта Импульс с понятным описанием, ограничениями и расчётом запуска.',
  canonicalPath: 'impuls',
}

describe('content DTO schemas', () => {
  it('normalizes product ids, locale and canonical paths', () => {
    const product = productSchema.parse({
      id: 'impuls',
      name: 'Импульс',
      shortName: 'Импульс',
      path: 'Impuls',
      promise: 'Помогает запускать лидогенерацию через проверенные аудитории.',
      primaryCta: {
        id: 'calculate-launch',
        label: 'Рассчитать запуск',
      },
      seo,
    }) satisfies ProductDTO

    expect(product.locale).toBe('ru-RU')
    expect(product.path).toBe('/impuls/')
    expect(product.seo.canonicalPath).toBe('/impuls/')
  })

  it('accepts representative page blocks and keeps inferred type stable', () => {
    const page = pageSchema.parse({
      id: 'home',
      path: '/',
      role: 'платформа и маршрутизация',
      intent: 'понять линейку и выбрать решение',
      h1: 'Импульс',
      seo: {
        title: 'Импульс — маркетинговая платформа AMS24',
        description: 'Главная страница платформы Импульс помогает выбрать продукт и запросить расчёт.',
        canonicalPath: '/',
      },
      blocks: [
        {
          blockType: 'hero',
          title: 'Импульс',
          lead: 'Единая платформа для привлечения, определения и защиты лидов.',
        },
        {
          blockType: 'product-routes',
          productRefs: ['impuls', 'pixel', 'zashchita'],
        },
        {
          blockType: 'lead-form-shell',
          intentId: 'home-final-calc',
        },
      ],
      status: 'draft',
    }) satisfies PageDTO

    expect(page.path).toBe('/')
    expect(page.blocks).toHaveLength(3)
  })

  it('normalizes lead intent paths without carrying PII', () => {
    const intent = leadIntentSchema.parse({
      sourcePath: 'pixel',
      productId: 'pixel',
      ctaId: 'check-applicability',
      consentVersion: 'consent-2026-09',
    }) satisfies LeadIntentDTO

    expect(intent.sourcePath).toBe('/pixel/')
  })

  it('rejects unsupported locale and non-canonical product refs', () => {
    expect(() =>
      productSchema.parse({
        id: 'unknown',
        locale: 'en-US',
        name: 'Unknown',
        shortName: 'Unknown',
        path: '/unknown/',
        promise: 'Unsupported product should not pass the content contract.',
        primaryCta: {
          id: 'cta',
          label: 'CTA',
        },
        seo,
      }),
    ).toThrow()
  })
})
