import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { Button } from '@/ui/primitives/button'
import { LeadForm } from '@/ui/forms/lead-form'

describe('canonical UI primitives', () => {
  it('keeps CTA links semantic when Button owns the visual style', () => {
    const html = renderToStaticMarkup(
      <Button asChild variant="outlineDark" size="xl">
        <a href="/kontakty/">Обсудить задачу</a>
      </Button>,
    )

    expect(html).toContain('<a')
    expect(html).toContain('href="/kontakty/"')
    expect(html).toContain('data-slot="button"')
    expect(html).toContain('data-variant="outlineDark"')
    expect(html).not.toContain('<button')
  })

  it('keeps form submit a real disabled button with accessible form context', () => {
    const html = renderToStaticMarkup(
      <LeadForm context={{ product: 'site', route: '/', ctaId: 'test-primary' }} surface="light" />,
    )

    expect(html).toContain('<form')
    expect(html).toContain('aria-label="Форма расчёта"')
    expect(html).toContain('aria-describedby="ams24-lead-form-status"')
    expect(html).toContain('name="product"')
    expect(html).toContain('value="site"')
    expect(html).toContain('name="route"')
    expect(html).toContain('value="/"')
    expect(html).toContain('name="ctaId"')
    expect(html).toContain('value="test-primary"')
    expect(html).toContain('<button')
    expect(html).toContain('type="submit"')
    expect(html).toContain('disabled=""')
    expect(html).toContain('aria-disabled="true"')
  })
})
