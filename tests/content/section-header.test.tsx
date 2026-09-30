import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { SectionHeader } from '@/ui/shared/section'

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
})
