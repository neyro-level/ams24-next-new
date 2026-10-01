import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

describe('T4.10 Design System records', () => {
  it('records the post-remediation audit with no unresolved P0 or P1 finding', async () => {
    const artifact = JSON.parse(
      await readFile(path.join(process.cwd(), 'docs/research/UI_DRIFT_AUDIT_ARTIFACTS_TC_T4_10.json'), 'utf8'),
    ) as {
      mode: string
      p0_count: number
      p1_count: number
      verdict: string
    }

    expect(artifact.mode).toBe('READ-ONLY AUDIT')
    expect(artifact.p0_count).toBe(0)
    expect(artifact.p1_count).toBe(0)
    expect(artifact.verdict).toBe('PASS WITH P2 FINDINGS')
  })

  it('keeps shared ownership and every approved exception in the canonical Design System', async () => {
    const designSystem = await readFile(path.join(process.cwd(), 'docs/06_DESIGN_SYSTEM.md'), 'utf8')

    expect(designSystem).toContain('### 10.1 Shared Patterns')
    for (const owner of [
      'src/ui/shared/container.tsx',
      'src/ui/shared/section.tsx',
      'src/ui/shared/section-header.tsx',
      'src/ui/forms/lead-form.tsx',
      'src/ui/pages/shared/product-section.tsx',
      'src/ui/content/rich-text.tsx',
    ]) {
      expect(designSystem).toContain(`\`${owner}\``)
    }
    for (const exception of ['DS-EX-01', 'DS-EX-02', 'DS-EX-03', 'DS-EX-04', 'DS-EX-05']) {
      expect(designSystem).toContain(`\`${exception}\``)
    }
  })
})
