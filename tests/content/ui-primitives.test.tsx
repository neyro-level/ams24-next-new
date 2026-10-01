import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import ErrorPage from '@/app/error'
import NotFound from '@/app/not-found'
import { cn } from '@/core/lib/utils'
import { Button } from '@/ui/primitives/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/ui/primitives/card'
import { Checkbox } from '@/ui/primitives/checkbox'
import { Input } from '@/ui/primitives/input'
import { Label } from '@/ui/primitives/label'
import { Textarea } from '@/ui/primitives/textarea'
import { LeadForm } from '@/ui/forms/lead-form'

describe('canonical UI primitives', () => {
  it('merges semantic typography roles independently from text colors', () => {
    expect(cn('text-h3', 'text-foreground')).toBe('text-h3 text-foreground')
    expect(cn('text-body', 'text-h2')).toBe('text-h2')
  })

  it('lets a semantic typography role override the button size without removing its foreground color', () => {
    const html = renderToStaticMarkup(<Button className="text-body-sm">Отправить</Button>)

    expect(html).toContain('text-body-sm')
    expect(html).toContain('text-primary-foreground')
    expect(html).not.toMatch(/class="[^"]*\btext-sm\b/)
  })

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

  it('owns every not-found CTA while preserving internal link semantics', () => {
    const html = renderToStaticMarkup(<NotFound />)

    expect(html.match(/data-slot="button"/g)).toHaveLength(3)
    expect(html.match(/<a /g)).toHaveLength(3)
    expect(html).toContain('href="/"')
    expect(html).toContain('href="/#products"')
    expect(html).toContain('href="/kontakty"')
    expect(html).not.toContain('<button')
  })

  it('keeps the error retry action semantic while links use the same CTA primitive', () => {
    const html = renderToStaticMarkup(<ErrorPage reset={() => undefined} />)

    expect(html.match(/data-slot="button"/g)).toHaveLength(3)
    expect(html.match(/<a /g)).toHaveLength(2)
    expect(html.match(/<button /g)).toHaveLength(1)
    expect(html).toContain('type="button"')
  })

  it('owns card surfaces through variants while preserving semantic elements', () => {
    const defaultCard = renderToStaticMarkup(<Card>Default</Card>)
    const mutedCard = renderToStaticMarkup(<Card variant="muted">Muted</Card>)
    const darkCard = renderToStaticMarkup(<Card variant="dark">Dark</Card>)
    const semanticCard = renderToStaticMarkup(
      <Card asChild>
        <article>
          <CardHeader>
            <CardTitle asChild><h3>Semantic title</h3></CardTitle>
            <CardDescription asChild><p>Semantic description</p></CardDescription>
          </CardHeader>
        </article>
      </Card>,
    )

    expect(defaultCard).toContain('data-variant="default"')
    expect(defaultCard).toContain('bg-surface-elevated')
    expect(mutedCard).toContain('data-variant="muted"')
    expect(mutedCard).toContain('bg-surface-muted')
    expect(darkCard).toContain('data-variant="dark"')
    expect(darkCard).toContain('bg-surface-dark-elevated')
    expect(semanticCard).toContain('<article')
    expect(semanticCard).toContain('data-slot="card"')
    expect(semanticCard).toContain('<h3 data-slot="card-title"')
    expect(semanticCard).toContain('<p data-slot="card-description"')
  })

  it('owns form controls with explicit light and dark surface variants', () => {
    const html = renderToStaticMarkup(
      <>
        <Label htmlFor="dark-name" surface="dark">Имя</Label>
        <Input id="dark-name" surface="dark" />
        <Textarea surface="light" />
        <Checkbox aria-label="Согласие" surface="dark" />
      </>,
    )

    expect(html).toContain('data-slot="label"')
    expect(html).toContain('data-slot="input"')
    expect(html).toContain('data-slot="textarea"')
    expect(html).toContain('data-slot="checkbox"')
    expect(html.match(/data-surface="dark"/g)).toHaveLength(3)
    expect(html).toContain('data-surface="light"')
    expect(html).not.toContain('dark:')
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
    expect(html.match(/data-slot="input"/g)).toHaveLength(2)
    expect(html).toContain('data-slot="textarea"')
    expect(html).toContain('data-slot="checkbox"')
    expect(html.match(/data-slot="label"/g)).toHaveLength(4)
    expect(html).toContain('data-surface="light"')
    expect(html).toContain('<button')
    expect(html).toContain('type="submit"')
    expect(html).toContain('disabled=""')
    expect(html).toContain('aria-disabled="true"')
  })

  it('applies dark form presentation through primitive variants', () => {
    const html = renderToStaticMarkup(
      <LeadForm context={{ product: 'site', route: '/', ctaId: 'test-dark' }} />,
    )

    expect(html.match(/data-surface="dark"/g)).toHaveLength(8)
    expect(html).not.toContain('dark:')
  })
})
