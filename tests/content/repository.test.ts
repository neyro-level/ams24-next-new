import { describe, expect, it } from 'vitest'

import { createContentRepository, type LocalContentInput } from '../../src/core/content/repository'
import { getContentRepository, resetContentRepositoryForTests } from '../../src/core/content/services/repository'
import { localContent } from '../../src/project/content/local-content'

describe('local content repository', () => {
  it('loads local content once and exposes normalized getters', async () => {
    resetContentRepositoryForTests()

    const first = getContentRepository()
    const second = getContentRepository()

    expect(first).toBe(second)
    expect('products' in first).toBe(false)
    expect('pages' in first).toBe(false)
    expect('siteSettings' in first).toBe(false)
    expect(first.getProducts()).toBeInstanceOf(Promise)
    expect((await first.getProduct('impuls'))?.path).toBe('/impuls/')
    await expect(first.getPageByPath('')).resolves.toMatchObject({ id: 'home' })
    await expect(first.getPageByPath('/')).resolves.toMatchObject({ id: 'home' })
  })

  it('resolves product refs through filtered getters', async () => {
    const repository = createContentRepository({
      ...localContent,
      cases: [
        {
          id: 'medical-case',
          path: '/keisy/medical-case/',
          slug: 'medical-case',
          productRefs: ['impuls'],
          niche: 'Медицина',
          period: '2026',
          updatedAt: '2026-09-30',
          problem: 'Клиенту требовалось проверить канал заявок без неподтверждённых обещаний.',
          method: 'Сценарий запуска описан как проверяемая последовательность действий.',
          evidenceLevel: 'anonymized',
          status: 'published',
          body: {
            format: 'markdown',
            value: 'Описание кейса.',
          },
          seo: {
            title: 'Кейс Импульс для медицинской ниши',
            description: 'Анонимизированный кейс показывает задачу, метод и ограничения результата.',
            canonicalPath: '/keisy/medical-case/',
          },
        },
      ],
    })

    await expect(repository.getCasesForProduct('impuls')).resolves.toHaveLength(1)
    await expect(repository.getCasesForProduct('pixel')).resolves.toHaveLength(0)
    await expect(repository.getCaseByPath('keisy/medical-case')).resolves.toMatchObject({ id: 'medical-case' })
  })

  it('hard-fails duplicate ids and duplicate canonical paths', () => {
    expect(() =>
      createContentRepository({
        ...localContent,
        products: [localContent.products[0], localContent.products[0]],
      }),
    ).toThrow(/Duplicate product id/)

    expect(() =>
      createContentRepository({
        ...localContent,
        pages: [
          localContent.pages[0],
          {
            ...localContent.pages[0],
            id: 'home-copy',
          },
        ],
      }),
    ).toThrow(/Duplicate localized page path/)
  })

  it('hard-fails broken product refs', () => {
    expect(() =>
      createContentRepository({
        ...localContent,
        tariffs: [
          {
            id: 'broken-tariff',
            productRef: 'pixel',
            title: 'Broken',
            pricingModel: 'custom',
            inclusions: ['one'],
          },
        ],
        products: [localContent.products[0]],
      }),
    ).toThrow(/Broken product ref/)
  })

  it('requires validated site settings and navigation at repository creation', () => {
    expect(() =>
      createContentRepository({ ...localContent, siteSettings: undefined } as unknown as LocalContentInput),
    ).toThrow()
    expect(() =>
      createContentRepository({ ...localContent, navigation: undefined } as unknown as LocalContentInput),
    ).toThrow()
  })
})
