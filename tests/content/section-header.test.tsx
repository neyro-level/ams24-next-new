import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { SectionHeader } from '@/ui/shared/section-header'

describe('SectionHeader', () => {
  it('keeps h2 semantic and visual defaults for existing callers', () => {
    const html = renderToStaticMarkup(<SectionHeader eyebrow="Eyebrow" title="Default heading" lead="Lead copy" />)

    expect(html).toContain('<h2')
    expect(html).toContain('text-h2')
    expect(html).toContain('Default heading')
    expect(html).toContain('Lead copy')
  })

  it('supports semantic heading level independent of visual role', () => {
    const html = renderToStaticMarkup(<SectionHeader level={3} visualRole="h2" title="Semantic h3, visual h2" />)

    expect(html).toContain('<h3')
    expect(html).not.toContain('<h2')
    expect(html).toContain('text-h2')
    expect(html).toContain('Semantic h3, visual h2')
  })

  it('resolves every dark tone role to one semantic text color', () => {
    const html = renderToStaticMarkup(
      <SectionHeader eyebrow="Eyebrow" title="Dark heading" lead="Dark lead" tone="dark" />,
    )
    const classes = [...html.matchAll(/class="([^"]+)"/g)].map((match) => match[1])

    expect(classes).toContain('mb-4 text-label font-bold uppercase text-surface-dark-faint')
    expect(classes).toContain('font-display text-h2 font-extrabold text-surface-dark-foreground')
    expect(classes).toContain('mt-5 text-body-lg text-surface-dark-muted')
    expect(html).not.toContain('text-foreground text-surface-dark-foreground')
  })
})
