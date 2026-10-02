import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

describe('Manrope delivery contract', () => {
  it('lets next/font emit the variable axis with Cyrillic coverage', () => {
    const layout = readFileSync(resolve(process.cwd(), 'src/app/layout.tsx'), 'utf8')
    const designSystem = readFileSync(resolve(process.cwd(), 'docs/06_DESIGN_SYSTEM.md'), 'utf8')
    const manropeOptions = layout.match(/Manrope\(\{(?<options>[\s\S]*?)\}\)/)?.groups?.options

    expect(manropeOptions).toBeDefined()
    expect(manropeOptions).toContain("subsets: ['latin', 'cyrillic']")
    expect(manropeOptions).not.toMatch(/\bweight\s*:/)
    expect(manropeOptions).toContain("variable: '--font-app-sans'")
    expect(designSystem).toContain('one variable Manrope axis (`200 800`)')
    expect(designSystem).toContain('semantic weights used by the UI: `400`, `500`, `600`, `700`, `800`')
  })
})
