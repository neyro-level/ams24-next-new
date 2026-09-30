import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

import { createContentRepository, type ContentRepository } from '@/core/content/repository'
import { assertValidContentGraph } from '@/core/content/validation'
import { localContent } from '@/project/content/local-content'

const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as {
  scripts: Record<string, string>
}

const requiredDailyVerifySteps = [
  'pnpm verify:runtime:self-test',
  'pnpm verify:runtime',
  'pnpm typecheck',
  'pnpm lint',
  'pnpm verify:content-graph',
  'pnpm test:content',
  'pnpm verify:sourcecraft',
  'pnpm guard:static:self-test',
  'pnpm guard:static',
] as const

const requiredReleaseVerifySteps = ['pnpm verify', 'pnpm build', 'pnpm guard:artifact'] as const

function invalidRepository(input: unknown): ContentRepository {
  return input as ContentRepository
}

function validateChainedScript(script: string, requiredSteps: readonly string[]) {
  const steps = script.split(' && ')

  return {
    hasExactSteps: JSON.stringify(steps) === JSON.stringify(requiredSteps),
    hasFailClosedChain: !/(?:^|[^&]);/.test(script) && !script.includes(' & '),
    missingSteps: requiredSteps.filter((step) => !steps.includes(step)),
  }
}

describe('daily verification command trace', () => {
  it('keeps pnpm verify as a fast chained proof without release build steps', () => {
    const verify = packageJson.scripts.verify
    const steps = verify.split(' && ')

    expect(packageJson.scripts['verify:content-graph']).toBe(
      'vitest run tests/verification/content-graph-daily.test.ts',
    )
    expect(steps).toEqual(requiredDailyVerifySteps)
    expect(verify.match(/pnpm verify:content-graph/g) ?? []).toHaveLength(1)
    expect(verify).not.toContain('pnpm build')
    expect(verify).not.toContain('pnpm guard:artifact')
  })

  it('uses && so each verify step fails closed before the next step', () => {
    const verify = packageJson.scripts.verify
    const chainedStepCount = verify.split(' && ').length

    expect(chainedStepCount).toBe(9)
    expect(verify).not.toMatch(/(?:^|[^&]);/)
    expect(verify).not.toContain(' & ')
  })

  it('keeps release verification as one verify, one build and one artifact guard', () => {
    const release = packageJson.scripts['verify:release']
    const steps = release.split(' && ')

    expect(steps).toEqual(requiredReleaseVerifySteps)
    expect(release.match(/pnpm verify/g) ?? []).toHaveLength(1)
    expect(release.match(/pnpm build/g) ?? []).toHaveLength(1)
    expect(release.match(/pnpm guard:artifact/g) ?? []).toHaveLength(1)
    expect(release).not.toMatch(/(?:^|[^&]);/)
    expect(release).not.toContain(' & ')
  })

  it('rejects seeded omissions from daily and release verification scripts', () => {
    for (const omitted of requiredDailyVerifySteps) {
      const mutated = requiredDailyVerifySteps.filter((step) => step !== omitted).join(' && ')
      const result = validateChainedScript(mutated, requiredDailyVerifySteps)

      expect(result.hasExactSteps, `daily omitted ${omitted}`).toBe(false)
      expect(result.missingSteps, `daily omitted ${omitted}`).toEqual([omitted])
    }

    for (const omitted of requiredReleaseVerifySteps) {
      const mutated = requiredReleaseVerifySteps.filter((step) => step !== omitted).join(' && ')
      const result = validateChainedScript(mutated, requiredReleaseVerifySteps)

      expect(result.hasExactSteps, `release omitted ${omitted}`).toBe(false)
      expect(result.missingSteps, `release omitted ${omitted}`).toEqual([omitted])
    }
  })

  it('rejects seeded non-fail-closed separators in verification scripts', () => {
    const dailyWithSoftSeparator = requiredDailyVerifySteps.join('; ')
    const releaseWithBackgroundSeparator = requiredReleaseVerifySteps.join(' & ')

    expect(validateChainedScript(dailyWithSoftSeparator, requiredDailyVerifySteps)).toMatchObject({
      hasExactSteps: false,
      hasFailClosedChain: false,
    })
    expect(validateChainedScript(releaseWithBackgroundSeparator, requiredReleaseVerifySteps)).toMatchObject({
      hasExactSteps: false,
      hasFailClosedChain: false,
    })
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
