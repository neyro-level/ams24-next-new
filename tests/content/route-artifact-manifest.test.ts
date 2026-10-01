import { describe, expect, it } from 'vitest'

import { createContentRepository } from '@/core/content/repository'
import { buildRouteArtifactManifest } from '@/core/seo'
import { localContent } from '@/project/content/local-content'

describe('repository-derived route artifact manifest', () => {
  it('describes every exported canonical route from repository and route contracts', async () => {
    const manifest = await buildRouteArtifactManifest(createContentRepository(localContent))
    const paths = manifest.routes.map((route) => route.path)

    expect(manifest.schema).toBe('ams-route-artifact-v1')
    expect(manifest.site).toEqual({ origin: 'https://ams24.ru', locale: 'ru-RU', siteName: 'Импульс' })
    expect(paths).toEqual([
      '/',
      '/baza-znaniy/',
      '/baza-znaniy/impuls/kak-podgotovit-raschet/',
      '/impuls/',
      '/keisy/',
      '/keisy/medical-case/',
      '/kontakty/',
      '/o-kompanii/',
      '/obrabotka-dannyh/',
      '/otzyvy/',
      '/pixel/',
      '/politika/',
      '/raschety/',
      '/rekvizity/',
      '/soglasie/',
      '/stati/',
      '/stati/kak-vybrat-produkt/',
      '/tarify/',
      '/zashchita/',
    ])
    expect(manifest.routes.filter((route) => route.indexPolicy === 'index').map((route) => route.path)).toEqual([
      '/',
      '/impuls/',
      '/pixel/',
      '/zashchita/',
    ])
    expect(manifest.routes.every((route) => route.locale === 'ru-RU' && route.h1.count === 1)).toBe(true)
    expect(paths).not.toContain(localContent.articles[0].path)
    expect(paths).not.toContain(localContent.knowledgeArticles[0].path)
  })

  it('derives canonical URLs from validated Site Settings instead of a production-domain fixture', async () => {
    const repository = createContentRepository({
      ...localContent,
      siteSettings: {
        ...localContent.siteSettings,
        domain: 'https://artifact.example',
      },
    })
    const manifest = await buildRouteArtifactManifest(repository)

    expect(manifest.site.origin).toBe('https://artifact.example')
    expect(manifest.routes.every((route) => route.canonicalUrl.startsWith('https://artifact.example/'))).toBe(true)
  })
})
