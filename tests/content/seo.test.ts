import { describe, expect, it } from 'vitest'

import { createContentRepository } from '@/core/content/repository'
import { getRequiredPageByPath } from '@/core/content/services/site-settings'
import {
  buildMetadata,
  buildSitemapEntries,
  buildSitemapPaths,
  buildStaticParams,
  validateRedirects,
} from '@/core/seo'
import robots from '@/app/robots'
import sitemap from '@/app/sitemap'
import { localContent } from '@/project/content/local-content'
import { redirects } from '@/project/redirects'

describe('SEO, routes and redirects', () => {
  it('builds metadata from validated SEO facts', async () => {
    const repository = createContentRepository(localContent)
    const page = await repository.getPageByPath('/')
    if (!page) throw new Error('Expected home page')
    const metadata = buildMetadata(page.seo, await repository.getSiteSettings())

    expect(metadata.title).toBe('Импульс — маркетинговые продукты AMS24')
    expect(metadata.alternates?.canonical).toBe('https://ams24.ru/')
    expect(metadata.robots).toMatchObject({ index: true, follow: true })

    const customMetadata = buildMetadata(page.seo, {
      ...(await repository.getSiteSettings()),
      domain: 'https://example.test',
      siteName: 'Example Site',
    })
    expect(customMetadata.alternates?.canonical).toBe('https://example.test/')
    expect(customMetadata.openGraph?.siteName).toBe('Example Site')

    const defaultMetadata = buildMetadata(undefined, await repository.getSiteSettings())
    expect(defaultMetadata.title).toBe((await repository.getSiteSettings()).defaultSeo.title)
  })

  it('fails with useful errors when canonical settings or page data is missing', async () => {
    const repository = createContentRepository({ ...localContent, pages: [] })
    const page = localContent.pages[0]

    expect(() => buildMetadata(page.seo, undefined as never)).toThrow(
      'Canonical Site Settings are missing or invalid',
    )
    await expect(getRequiredPageByPath('/', repository)).rejects.toThrow(
      'Canonical page content is missing: /',
    )
  })

  it('includes only published indexable routes in sitemap paths', async () => {
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
          slug: 'politika',
          path: '/politika/',
          h1: 'Политика обработки данных',
          seo: {
            title: 'Политика обработки персональных данных AMS24',
            description: 'Юридическая страница описывает правила обработки персональных данных.',
            canonicalPath: '/politika/',
            robots: 'noindex',
          },
          status: 'hidden',
        },
      ],
    })

    await expect(buildSitemapPaths(repository)).resolves.toEqual(['/', '/impuls/', '/pixel/', '/zashchita/'])
    await expect(buildSitemapEntries(repository)).resolves.toEqual([
      { path: '/', lastModified: '2026-09-30' },
      { path: '/impuls/', lastModified: '2026-09-30' },
      { path: '/pixel/', lastModified: '2026-09-30' },
      { path: '/zashchita/', lastModified: '2026-09-30' },
    ])
  })

  it('generates app sitemap and robots from repository-owned SEO facts', async () => {
    await expect(sitemap()).resolves.toEqual([
      { url: 'https://ams24.ru/', lastModified: '2026-09-30' },
      { url: 'https://ams24.ru/impuls/', lastModified: '2026-09-30' },
      { url: 'https://ams24.ru/pixel/', lastModified: '2026-09-30' },
      { url: 'https://ams24.ru/zashchita/', lastModified: '2026-09-30' },
    ])

    await expect(robots()).resolves.toEqual({
      rules: {
        userAgent: '*',
        allow: '/',
      },
      sitemap: 'https://ams24.ru/sitemap.xml',
      host: 'https://ams24.ru',
    })
  })

  it('builds static params from canonical paths', () => {
    expect(buildStaticParams(['/stati/pervaya-statya/'], '/stati/')).toEqual([
      {
        slug: ['pervaya-statya'],
      },
    ])

    expect(buildStaticParams(['Stati/Pervaya-Statya'], 'stati')).toEqual([
      {
        slug: ['pervaya-statya'],
      },
    ])

    expect(() => buildStaticParams(['/keisy/case/'], '/stati/')).toThrow(/does not belong/)
    expect(() => buildStaticParams(['/stati//case/'], '/stati/')).toThrow(/ambiguous/)
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

    expect(() =>
      validateRedirects([
        { source: '/unsafe//path/', destination: '/pixel/', permanent: true },
      ]),
    ).toThrow(/unsafe or ambiguous/)
  })
})
