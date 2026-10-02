import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

import { createContentRepository } from '@/core/content/repository'
import { assertValidContentGraph } from '@/core/content/validation'
import { localContent } from '@/project/content/local-content'

const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as {
  scripts: Record<string, string>
}
const sourceCraftCi = readFileSync('.sourcecraft/ci.yaml', 'utf8')

const requiredDailyVerifySteps = [
  'pnpm verify:runtime:self-test',
  'pnpm verify:runtime',
  'pnpm typecheck',
  'pnpm lint',
  'pnpm verify:content-graph',
  'pnpm test:content',
  'pnpm verify:sourcecraft:self-test',
  'pnpm verify:sourcecraft',
  'pnpm verify:nginx-redirects:self-test',
  'pnpm verify:nginx-redirects',
  'pnpm verify:nginx:self-test',
  'pnpm verify:nginx',
  'pnpm verify:rollout:self-test',
  'pnpm verify:rollout',
  'pnpm smoke:self-test',
  'pnpm guard:static:self-test',
  'pnpm guard:static',
] as const

const requiredReleaseVerifySteps = [
  'pnpm verify',
  'pnpm generate:precompressed:self-test',
  'pnpm build',
  'pnpm generate:precompressed',
  'pnpm guard:artifact',
  'pnpm test:e2e:nginx',
] as const

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

    expect(chainedStepCount).toBe(requiredDailyVerifySteps.length)
    expect(verify).not.toMatch(/(?:^|[^&]);/)
    expect(verify).not.toContain(' & ')
  })

  it('keeps release verification as one verify, one build, one artifact guard and one browser proof', () => {
    const release = packageJson.scripts['verify:release']
    const steps = release.split(' && ')

    expect(steps).toEqual(requiredReleaseVerifySteps)
    expect(release.match(/pnpm verify/g) ?? []).toHaveLength(1)
    expect(release.match(/pnpm build/g) ?? []).toHaveLength(1)
    expect(release.match(/pnpm guard:artifact/g) ?? []).toHaveLength(1)
    expect(release.match(/pnpm test:e2e:nginx/g) ?? []).toHaveLength(1)
    expect(release).not.toMatch(/(?:^|[^&]);/)
    expect(release).not.toContain(' & ')
  })

  it('allows the browser step to skip only in exact-head SourceCraft workflows without nested Docker', () => {
    expect(sourceCraftCi.match(/AMS24_E2E_MODE=sourcecraft-no-nested-docker/g) ?? []).toHaveLength(2)
    expect(sourceCraftCi).toContain('test "$SOURCECRAFT_EVENT" = "manual"')
    expect(sourceCraftCi).toContain('test "$SOURCECRAFT_COMMIT_SHA" = "${{ inputs.expected_commit_sha }}"')
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

  it('propagates graph validation failures through the assertion API', async () => {
    const repository = createContentRepository({
      ...localContent,
      navigation: {
        ...localContent.navigation,
        header: [{ label: 'Missing', path: '/missing/' }],
      },
    })

    await expect(assertValidContentGraph(repository)).rejects.toThrow(/Content graph validation failed/)
  })
})
