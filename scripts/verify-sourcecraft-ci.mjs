import { readFile } from 'node:fs/promises'
import path from 'node:path'

const ciPath = path.join(process.cwd(), '.sourcecraft', 'ci.yaml')
const workflowNames = ['merge-standard', 'merge-risky']

async function readRuntimeContract() {
  const [nodeVersion, packageJsonSource] = await Promise.all([
    readFile(path.join(process.cwd(), '.node-version'), 'utf8'),
    readFile(path.join(process.cwd(), 'package.json'), 'utf8'),
  ])
  const packageManager = JSON.parse(packageJsonSource).packageManager

  return {
    nodeVersion: nodeVersion.trim(),
    packageManager,
    pnpmVersion: packageManager.replace(/^pnpm@/, ''),
  }
}

function stripComments(line) {
  const hashIndex = line.indexOf('#')

  if (hashIndex === -1) {
    return line
  }

  return line.slice(0, hashIndex)
}

function hasLineMatching(lines, pattern) {
  return lines.some((line) => pattern.test(stripComments(line)))
}

function hasBlock(text, workflowName) {
  return new RegExp(`^  ${workflowName}:\\r?\\n[\\s\\S]*?(?=^  [a-zA-Z0-9_-]+:|(?![\\s\\S]))`, 'm').test(text)
}

function countMatches(text, pattern) {
  return [...text.matchAll(pattern)].length
}

function getDeclaredWorkflowNames(source) {
  const workflowsStart = source.match(/^workflows:\s*$/m)
  if (!workflowsStart) {
    return []
  }

  const afterWorkflows = source.slice(workflowsStart.index + workflowsStart[0].length)

  return [...afterWorkflows.matchAll(/^  ([a-zA-Z0-9_-]+):\s*$/gm)].map((match) => match[1])
}

function analyzeSourcecraftCi(source, contract) {
  const lines = source.split(/\r?\n/)
  const errors = []

  if (hasLineMatching(lines, /^on\s*:/)) {
    errors.push('.sourcecraft/ci.yaml must not define an on: section')
  }

  for (const trigger of ['push', 'pull_request', 'schedule']) {
    if (hasLineMatching(lines, new RegExp(`^\\s+${trigger}\\s*:`))) {
      errors.push(`automatic SourceCraft trigger is forbidden: ${trigger}`)
    }
  }

  const declaredWorkflows = getDeclaredWorkflowNames(source)
  const allowedWorkflows = new Set(workflowNames)
  const extraWorkflows = declaredWorkflows.filter((workflow) => !allowedWorkflows.has(workflow))

  if (extraWorkflows.length > 0) {
    errors.push(`unexpected paid workflow is forbidden: ${extraWorkflows.join(', ')}`)
  }

  for (const workflow of workflowNames) {
    const declarationCount = declaredWorkflows.filter((declared) => declared === workflow).length
    if (declarationCount > 1) {
      errors.push(`${workflow} must be declared exactly once`)
    }
  }

  for (const workflow of workflowNames) {
    if (!hasBlock(source, workflow)) {
      errors.push(`manual workflow is missing: ${workflow}`)
      continue
    }

    const block = source.match(
      new RegExp(`^  ${workflow}:\\r?\\n([\\s\\S]*?)(?=^  [a-zA-Z0-9_-]+:|(?![\\s\\S]))`, 'm'),
    )?.[1] ?? ''

    if (countMatches(block, /^    tasks:\s*$/gm) !== 1) {
      errors.push(`${workflow} must define exactly one task list`)
    }

    if (countMatches(block, /^        cubes:\s*$/gm) !== 1) {
      errors.push(`${workflow} must define exactly one cube list`)
    }

    if (countMatches(block, /^            image:\s+/gm) !== 1) {
      errors.push(`${workflow} must define exactly one paid cube image`)
    }

    if (!/inputs:\r?\n[\s\S]*expected_commit_sha:\r?\n[\s\S]*required:\s*true/.test(block)) {
      errors.push(`${workflow} must require expected_commit_sha input`)
    }

    if (!/test "\$SOURCECRAFT_EVENT" = "manual"/.test(block)) {
      errors.push(`${workflow} must fail unless SOURCECRAFT_EVENT is manual`)
    }

    if (!/test "\$SOURCECRAFT_COMMIT_SHA" = "\$\{\{ inputs\.expected_commit_sha \}\}"/.test(block)) {
      errors.push(`${workflow} must compare SOURCECRAFT_COMMIT_SHA to expected_commit_sha`)
    }

    if (!/EXPECTED_COMMIT_SHA="\$\{\{ inputs\.expected_commit_sha \}\}"/.test(block)) {
      errors.push(`${workflow} must export expected_commit_sha for the exact-head guard`)
    }

    if (!/node scripts\/verify-sourcecraft-head\.mjs/.test(block)) {
      errors.push(`${workflow} must compare checked-out Git HEAD to expected_commit_sha without requiring git in the container`)
    }

    if (!block.includes(`image: docker.io/library/node:${contract.nodeVersion}-alpine`)) {
      errors.push(`${workflow} must use pinned Node image docker.io/library/node:${contract.nodeVersion}-alpine`)
    }

    if (!block.includes(`corepack prepare ${contract.packageManager} --activate`)) {
      errors.push(`${workflow} must activate exact ${contract.packageManager} before install`)
    }

    if (!/corepack pnpm install --frozen-lockfile/.test(block)) {
      errors.push(`${workflow} must install with --frozen-lockfile`)
    }

    if (!/node scripts\/verify-runtime-versions\.mjs/.test(block)) {
      errors.push(`${workflow} must run the runtime version guard`)
    }
  }

  return errors
}

function buildValidFixture(contract) {
  return `workflows:
  merge-standard:
    inputs:
      expected_commit_sha:
        required: true
    tasks:
      - name: verify
        cubes:
          - name: static-site-standard
            image: docker.io/library/node:${contract.nodeVersion}-alpine
            script:
              - |
                test "$SOURCECRAFT_EVENT" = "manual"
                test "$SOURCECRAFT_COMMIT_SHA" = "\${{ inputs.expected_commit_sha }}"
                EXPECTED_COMMIT_SHA="\${{ inputs.expected_commit_sha }}"
                export EXPECTED_COMMIT_SHA
                node scripts/verify-sourcecraft-head.mjs
                corepack prepare ${contract.packageManager} --activate
                node scripts/verify-runtime-versions.mjs
                corepack pnpm install --frozen-lockfile
  merge-risky:
    inputs:
      expected_commit_sha:
        required: true
      risk_reason:
        required: true
    tasks:
      - name: verify
        cubes:
          - name: static-site-risky
            image: docker.io/library/node:${contract.nodeVersion}-alpine
            script:
              - |
                test "$SOURCECRAFT_EVENT" = "manual"
                test "$SOURCECRAFT_COMMIT_SHA" = "\${{ inputs.expected_commit_sha }}"
                EXPECTED_COMMIT_SHA="\${{ inputs.expected_commit_sha }}"
                export EXPECTED_COMMIT_SHA
                node scripts/verify-sourcecraft-head.mjs
                corepack prepare ${contract.packageManager} --activate
                node scripts/verify-runtime-versions.mjs
                corepack pnpm install --frozen-lockfile
`
}

async function runSelfTest() {
  const contract = await readRuntimeContract()
  const valid = buildValidFixture(contract)
  const cases = [
    ['valid baseline', valid, 0],
    ['automatic trigger', `on:\n  push:\n${valid}`, 2],
    ['floating node image', valid.replaceAll(`node:${contract.nodeVersion}-alpine`, 'node:24-alpine'), 2],
    ['missing frozen install', valid.replaceAll('corepack pnpm install --frozen-lockfile', 'corepack pnpm install'), 2],
    ['missing exact-head script', valid.replaceAll('node scripts/verify-sourcecraft-head.mjs', ''), 2],
    [
      'wrong package manager activation',
      valid.replaceAll(`corepack prepare ${contract.packageManager} --activate`, `corepack prepare pnpm@${Number(contract.pnpmVersion.split('.')[0]) - 1}.0.0 --activate`),
      2,
    ],
    [
      'extra paid workflow',
      valid.replace(
        '  merge-risky:',
        `  release-check:
    inputs:
      expected_commit_sha:
        required: true
    tasks:
      - name: verify
        cubes:
          - name: duplicate-paid-run
            image: docker.io/library/node:${contract.nodeVersion}-alpine
            script:
              - corepack pnpm verify
  merge-risky:`,
      ),
      1,
    ],
    [
      'duplicate paid cube',
      valid.replace(
        '          - name: static-site-standard',
        `          - name: duplicate-standard-paid-run
            image: docker.io/library/node:${contract.nodeVersion}-alpine
          - name: static-site-standard`,
      ),
      1,
    ],
  ]

  const failures = []
  for (const [name, source, expectedErrors] of cases) {
    const errors = analyzeSourcecraftCi(source, contract)
    if (errors.length !== expectedErrors) {
      failures.push(`${name}: expected ${expectedErrors} errors, got ${errors.length}: ${errors.join('; ')}`)
      continue
    }
    console.log(`SourceCraft CI policy self-test fixture "${name}": PASS (${errors.length} expected findings)`)
  }

  if (failures.length > 0) {
    console.error('SourceCraft CI policy self-test: FAIL')
    for (const failure of failures) {
      console.error(`- ${failure}`)
    }
    process.exitCode = 1
    return
  }

  console.log('SourceCraft CI policy self-test: PASS')
}

async function main() {
  if (process.argv.includes('--self-test')) {
    await runSelfTest()
    return
  }

  const [source, contract] = await Promise.all([readFile(ciPath, 'utf8'), readRuntimeContract()])
  const errors = analyzeSourcecraftCi(source, contract)

  if (errors.length > 0) {
    console.error('SourceCraft CI policy: FAIL')
    for (const error of errors) {
      console.error(`- ${error}`)
    }
    process.exitCode = 1
    return
  }

  console.log('SourceCraft CI policy: PASS')
}

await main()
