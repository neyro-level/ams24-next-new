import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

describe('design token disposition', () => {
  it('removes confirmed dead aliases and arbitrary brand tracking', async () => {
    const css = await readFile(path.join(process.cwd(), 'src/app/globals.css'), 'utf8')
    const header = await readFile(path.join(process.cwd(), 'src/ui/shell/site-header.tsx'), 'utf8')

    for (const token of ['--aspect-card', '--aspect-hero', '--radius-pill', '--ease-standard', '--ease-out-soft']) {
      expect(css).not.toContain(token)
    }
    expect(header).not.toContain('tracking-[')
  })

  it('keeps used and explicitly reserved semantic tokens', async () => {
    const css = await readFile(path.join(process.cwd(), 'src/app/globals.css'), 'utf8')
    const designSystem = await readFile(path.join(process.cwd(), 'docs/06_DESIGN_SYSTEM.md'), 'utf8')

    for (const token of ['--text-display', '--font-display', '--success', '--warning', '--shadow-panel']) {
      expect(css).toContain(token)
    }
    for (const token of ['text-display', '--font-display', 'aspect-card', 'aspect-hero', 'success', 'warning', 'shadow-panel', 'radius-pill', 'ease-*']) {
      expect(designSystem).toContain(`\`${token}\``)
    }
  })
})
