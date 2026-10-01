import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import { createContentRepository } from '@/core/content/repository'
import { buildSitemapPaths, validateRedirects } from '@/core/seo'
import { metadata as contactsMetadata } from '@/app/kontakty/page'
import { metadata as dataProcessingMetadata } from '@/app/obrabotka-dannyh/page'
import { metadata as policyMetadata } from '@/app/politika/page'
import { metadata as consentMetadata } from '@/app/soglasie/page'
import { redirects } from '@/project/redirects'
import { localContent } from '@/project/content/local-content'
import { siteOrigin } from '@/project/site'
import { buildLegalMetadata } from '@/core/content/services/legal-pages'

const indexableStaticPaths = ['/', '/impuls/', '/pixel/', '/zashchita/'] as const
const guardedStaticPaths = [
  '/tarify/',
  '/raschety/',
  '/keisy/',
  '/otzyvy/',
  '/kontakty/',
  '/politika/',
  '/soglasie/',
  '/obrabotka-dannyh/',
] as const

describe('final static SEO/security hardening', () => {
  it('keeps sitemap restricted to approved indexable public routes', async () => {
    const repository = createContentRepository(localContent)
    const sitemapPaths = await buildSitemapPaths(repository)

    expect(sitemapPaths).toEqual(['/', '/impuls/', '/pixel/', '/zashchita/'])
    expect(indexableStaticPaths).toContain('/')

    for (const path of guardedStaticPaths) {
      expect(sitemapPaths).not.toContain(path)
    }
  })

  it('keeps legal and contact routes noindex until external approvals are supplied', () => {
    expect(contactsMetadata.robots).toMatchObject({ index: false, follow: true })
    expect(policyMetadata).toEqual(buildLegalMetadata('policy'))
    expect(consentMetadata).toEqual(buildLegalMetadata('consent'))
    expect(dataProcessingMetadata).toEqual(buildLegalMetadata('data-processing'))

    for (const metadata of [policyMetadata, consentMetadata, dataProcessingMetadata]) {
      expect(metadata.robots).toMatchObject({ index: false, follow: true })
      expect(metadata.title).toContain('черновая страница')
    }
  })

  it('keeps canonical host and redirect rules explicit', () => {
    expect(new URL(siteOrigin).toString()).toBe('https://ams24.ru/')
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
  })

  it('has documented public-release blockers for incomplete external inputs', () => {
    const evidencePath = join(process.cwd(), 'docs/research/SEO_HARDENING_EPIC_08_5.md')

    expect(existsSync(evidencePath)).toBe(true)
  })
})
