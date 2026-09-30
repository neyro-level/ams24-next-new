import { describe, expect, it } from 'vitest'

import { createContentRepository } from '@/core/content/repository'
import {
  createContentCatalogViewModel,
  createNavigationViewModel,
  createSiteSettingsViewModel,
  getNavigationViewModel,
  getSiteSettingsViewModel,
} from '@/core/content/services/view-models'
import { localContent } from '@/project/content/local-content'

describe('content service ViewModels', () => {
  it('exposes validated site settings and navigation ViewModels from repository data', () => {
    const site = getSiteSettingsViewModel(createContentRepository(localContent))
    const navigation = getNavigationViewModel(createContentRepository(localContent))

    expect(site).toMatchObject({
      locale: 'ru-RU',
      siteName: 'Импульс',
      siteOrigin: 'https://ams24.ru',
    })
    expect(site.defaultSeo.canonicalPath).toBe('/')

    expect(navigation.primaryCta).toEqual({
      label: 'Получить расчёт',
      path: '/#lead-form',
    })
    expect(navigation.productLinks.map((link) => link.path)).toEqual([
      '/impuls/',
      '/pixel/',
      '/zashchita/',
    ])
    expect(navigation.firstLevelRoutes.some((link) => link.path === '/kontakty/')).toBe(true)
  })

  it('hard-fails invalid site settings fixtures before UI can consume them', () => {
    expect(() =>
      createSiteSettingsViewModel({
        ...localContent.siteSettings,
        domain: 'ams24.ru',
      }),
    ).toThrow()
  })

  it('hard-fails invalid navigation fixtures before UI can consume them', () => {
    const repository = createContentRepository(localContent)
    const content = createContentCatalogViewModel(repository)

    expect(() =>
      createNavigationViewModel(
        {
          ...localContent.navigation,
          header: [{ label: 'Bad external', path: 'https://example.com' }],
        },
        content,
      ),
    ).toThrow()

    expect(() =>
      createNavigationViewModel(
        {
          ...localContent.navigation,
          footer: {
            Empty: [],
          },
        },
        content,
      ),
    ).toThrow()
  })
})
