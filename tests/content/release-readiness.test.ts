import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('release readiness guard', () => {
  it('records production boundary and unresolved release blockers without secrets', () => {
    const document = readFileSync(join(process.cwd(), 'docs/research/RELEASE_READINESS_EPIC_09.md'), 'utf8')

    expect(document).toContain('Production: not authorized / not entered')
    expect(document).toContain('06202b94b1da805b801e75b551f5d22194740f25')
    expect(document).toContain('AMS Main Server route')
    expect(document).toContain('ams-server/prod')
    expect(document).toContain('forms are disabled and typed')
    expect(document).toContain('legal pages are draft/noindex')
    expect(document).toContain('analytics adapter is noop')
    expect(document).toContain('durable artifact store/path is confirmed')
    expect(document).not.toMatch(/(?:password|token|secret|private key)\s*[:=]\s*\S+/i)
  })

  it('keeps release checklist explicit about repository-ready versus production-only blockers', () => {
    const checklist = readFileSync(join(process.cwd(), 'docs/05_RELEASE_CHECKLIST.md'), 'utf8')

    expect(checklist).toContain('## 0. Current Readiness Snapshot')
    expect(checklist).toContain('docs/research/BASELINE_CLAIMS_REGISTER_CR_00_1.md')
    expect(checklist).toContain('approved for remediation work')
    expect(checklist).toContain('Production-only blockers')
    expect(checklist).toContain('production release is still blocked')
    expect(checklist).toContain('no explicit owner production command')
    expect(checklist).toContain('live AMS Leads API endpoint/schema not approved')
  })
})
