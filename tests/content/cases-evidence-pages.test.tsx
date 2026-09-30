import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import CasesPage, { metadata as casesMetadata } from '@/app/keisy/page'
import { buildDetailFixtureMetadata, getDetailFixture } from '@/project/detail-fixtures'
import { proofEvidenceInventory } from '@/project/proof-inventory'
import { staticRouteSkeletons } from '@/project/route-skeletons'
import { DetailFixturePage } from '@/ui/shell/detail-fixture-page'

describe('cases evidence pages', () => {
  it('keeps cases hub noindex and tied to hidden case inventory until OD-01 evidence exists', () => {
    const html = renderToStaticMarkup(<CasesPage />)
    const caseItems = proofEvidenceInventory.filter((item) => item.kind === 'case')

    expect(casesMetadata.alternates?.canonical).toBe('https://ams24.ru/keisy/')
    expect(casesMetadata.robots).toMatchObject({ index: false, follow: true })
    expect(staticRouteSkeletons.some((route) => route.path === '/keisy/')).toBe(false)
    expect(html.match(/<h1\b/g)).toHaveLength(1)
    expect(html).toContain('Evidence contract')
    expect(html).toContain('OD-01')

    for (const item of caseItems) {
      expect(html).toContain(item.title)
      expect(html).toContain(item.releaseMinimumSlot)
      expect(html).toContain('publicationStatus')
      expect(html).toContain('hidden')
      expect(html).toContain('permissionState')
    }
  })

  it('keeps representative case detail noindex and explicit about required evidence fields', () => {
    const fixture = getDetailFixture('case', 'medical-case')
    const metadata = buildDetailFixtureMetadata(fixture)
    const html = renderToStaticMarkup(<DetailFixturePage fixture={fixture} />)

    expect(metadata.robots).toMatchObject({ index: false, follow: true })
    expect(html).toContain('Источник')
    expect(html).toContain('Период')
    expect(html).toContain('Методика расчёта')
    expect(html).toContain('Метрики')
    expect(html).toContain('Разрешение на публикацию')
    expect(html).toContain('skeleton-fixture')
    expect(html).not.toMatch(/опубликованный кейс|подтверждённый результат|рост на \d+/i)
  })
})
