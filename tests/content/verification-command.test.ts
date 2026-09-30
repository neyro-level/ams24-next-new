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
  it('invokes content graph verification exactly once from pnpm verify', () => {
    const verify = packageJson.scripts.verify

    expect(packageJson.scripts['verify:content-graph']).toBe(
      'vitest run tests/verification/content-graph-daily.test.ts',
    )
    expect(verify.match(/pnpm verify:content-graph/g) ?? []).toHaveLength(1)
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
