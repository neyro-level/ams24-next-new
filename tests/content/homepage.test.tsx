import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import HomePage from '@/app/page'

describe('representative homepage', () => {
  it('renders the approved composition patterns', async () => {
    const html = renderToStaticMarkup(await HomePage())

    expect(html.match(/<h1\b/g)).toHaveLength(1)
    expect(html).toContain('href="/impuls/"')
    expect(html).toContain('href="/pixel/"')
    expect(html).toContain('href="/zashchita/"')
    expect(html).toContain('Материал')
    expect(html).toContain('aria-label="Форма расчёта"')
    expect(html).toContain('data-form-id="ams24-lead-form"')
    expect(html).toContain('data-analytics-event="lead_form_view"')
  })

  it('keeps design-intake accessibility and mobile invariants measurable', async () => {
    const html = renderToStaticMarkup(await HomePage())

    expect(html).toContain('href="#lead-form"')
    expect(html).toContain('href="#products"')
    expect(html).toContain('aria-label="Карта продуктов"')
    expect(html).toContain('grid-cols')
    expect(html).toContain('sm:grid-cols')
    expect(html).toContain('lg:grid-cols')
    expect(html.match(/<label\b/g)?.length ?? 0).toBeGreaterThanOrEqual(3)
    expect(html.match(/disabled=""/g)?.length ?? 0).toBeGreaterThanOrEqual(4)
    expect(html).not.toContain('bg-black')
    expect(html).not.toContain('from-')
    expect(html).not.toContain('to-')
  })
})
