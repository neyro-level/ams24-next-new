import { describe, expect, it } from 'vitest'

import { createContentRepository } from '@/core/content/repository'
import { buildMetadata, buildSitemapPaths, buildStaticParams, validateRedirects } from '@/core/seo'
import { localContent } from '@/project/content/local-content'
import { redirects } from '@/project/redirects'

describe('SEO, routes and redirects', () => {
  it('builds metadata from validated SEO facts', () => {
    const repository = createContentRepository(localContent)
    const metadata = buildMetadata(repository.getPageByPath('/')!.seo)

    expect(metadata.title).toBe('Импульс — маркетинговые продукты AMS24')
    expect(metadata.alternates?.canonical).toBe('https://ams24.ru/')
    expect(metadata.robots).toMatchObject({ index: true, follow: true })
  })

  it('includes only published indexable routes in sitemap paths', () => {
    const repository = createContentRepository({
      ...localContent,
      pages: [
        {
          ...localContent.pages[0],
          status: 'published',
        },
        {
          ...localContent.pages[0],
          id: 'policy',
          path: '/politika/',
          h1: 'Политика обработки данных',
          seo: {
            title: 'Политика обработки персональных данных AMS24',
            description: 'Юридическая страница описывает правила обработки персональных данных.',
            canonicalPath: '/politika/',
            robots: 'noindex',
          },
          status: 'published',
        },
      ],
    })

    expect(buildSitemapPaths(repository)).toEqual(['/'])
  })

  it('builds static params from canonical paths', () => {
    expect(buildStaticParams(['/stati/pervaya-statya/'], '/stati/')).toEqual([
      {
        slug: ['pervaya-statya'],
      },
    ])

    expect(() => buildStaticParams(['/keisy/case/'], '/stati/')).toThrow(/does not belong/)
  })

  it('validates redirects without loops, duplicates or chains', () => {
    expect(validateRedirects(redirects)).toEqual([
      {
        source: '/identifikatsiya-posetiteley-sayta/',
        destination: '/pixel/',
        permanent: true,
      },
      {
        source: '/zashchita-ot-perekhvata-lidov/',
        destination: '/zashchita/',
        permanent: true,
      },
    ])

    expect(() =>
      validateRedirects([
        { source: '/a/', destination: '/b/', permanent: true },
        { source: '/b/', destination: '/c/', permanent: true },
      ]),
    ).toThrow(/Redirect chain/)
  })
})
