import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

import { createContentRepository, type ContentRepository } from '@/core/content/repository'
import { assertValidContentGraph } from '@/core/content/validation'
import { localContent } from '@/project/content/local-content'

const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as {
  scripts: Record<string, string>
}

function invalidRepository(input: unknown): ContentRepository {
  return input as ContentRepository
}

describe('daily verification command trace', () => {
  it('keeps pnpm verify as a fast chained proof without release build steps', () => {
    const verify = packageJson.scripts.verify
    const steps = verify.split(' && ')

    expect(packageJson.scripts['verify:content-graph']).toBe(
      'vitest run tests/verification/content-graph-daily.test.ts',
    )
    expect(steps).toEqual([
      'pnpm typecheck',
      'pnpm lint',
      'pnpm verify:content-graph',
      'pnpm test:content',
      'pnpm verify:sourcecraft',
      'pnpm guard:static:self-test',
      'pnpm guard:static',
    ])
    expect(verify.match(/pnpm verify:content-graph/g) ?? []).toHaveLength(1)
    expect(verify).not.toContain('pnpm build')
    expect(verify).not.toContain('pnpm guard:artifact')
  })

  it('uses && so each verify step fails closed before the next step', () => {
    const verify = packageJson.scripts.verify
    const chainedStepCount = verify.split(' && ').length

    expect(chainedStepCount).toBe(7)
    expect(verify).not.toMatch(/(?:^|[^&]);/)
    expect(verify).not.toContain(' & ')
  })

  it('propagates graph validation failures through the assertion API', () => {
    const repository = invalidRepository({
      ...createContentRepository(localContent),
      navigation: {
        ...createContentRepository(localContent).navigation!,
        header: [{ label: 'Missing', path: '/missing/' }],
      },
    })

    expect(() => assertValidContentGraph(repository)).toThrow(/Content graph validation failed/)
  })
})
