import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import CasesPage, { generateMetadata as generateCasesMetadata } from '@/app/keisy/page'
import { proofEvidenceInventory } from '@/project/proof-inventory'
import { staticRouteSkeletons } from '@/core/content/services/route-skeletons'

describe('cases evidence pages', () => {
  it('keeps cases hub noindex and tied to hidden case inventory until evidence exists', async () => {
    const casesMetadata = await generateCasesMetadata()
    const html = renderToStaticMarkup(<CasesPage />)
    const caseItems = proofEvidenceInventory.filter((item) => item.kind === 'case')

    expect(casesMetadata.alternates?.canonical).toBe('https://ams24.ru/keisy/')
    expect(casesMetadata.robots).toMatchObject({ index: false, follow: true })
    expect(staticRouteSkeletons.some((route) => route.path === '/keisy/')).toBe(false)
    expect(html.match(/<h1\b/g)).toHaveLength(1)
    expect(html).toContain('Требования к кейсам')
    expect(html).toContain('Пока нет подтверждённых материалов')

    for (const item of caseItems) {
      expect(html).toContain(item.title)
      expect(html).toContain(item.releaseMinimumSlot)
      expect(html).toContain('Статус')
      expect(html).toContain('скрыто до подтверждения')
      expect(html).toContain('Разрешение')
    }
  })

  it('keeps case details absent while retaining hidden evidence inventory', () => {
    const caseItems = proofEvidenceInventory.filter((item) => item.kind === 'case')

    expect(existsSync(join(process.cwd(), 'src/app/keisy/[slug]/page.tsx'))).toBe(false)
    expect(caseItems).toHaveLength(3)
    expect(caseItems.every((item) => item.publicationStatus === 'hidden')).toBe(true)
    expect(caseItems.every((item) => item.evidenceState === 'missing')).toBe(true)
  })
})
