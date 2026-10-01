import { readFile } from 'node:fs/promises'
import path from 'node:path'

const ciPath = path.join(process.cwd(), '.sourcecraft', 'ci.yaml')
const workflowNames = ['merge-standard', 'merge-risky', 'release-artifact']

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

    if (workflow === 'merge-standard') {
      if (!/corepack pnpm verify\s*(?:\r?\n|$)/.test(block)) {
        errors.push('merge-standard must run the smaller verify proof')
      }
      if (/corepack pnpm verify:release/.test(block)) {
        errors.push('merge-standard must not duplicate the RISKY release proof')
      }
    }

    if (workflow === 'merge-risky' && !/corepack pnpm verify:release/.test(block)) {
      errors.push('merge-risky must run corepack pnpm verify:release')
    }

    if (workflow === 'release-artifact') {
      if (!/test "\$SOURCECRAFT_COMMIT_REF" = "refs\/heads\/main"/.test(block)) {
        errors.push('release-artifact must fail unless the selected ref is main')
      }
      if (countMatches(block, /corepack pnpm verify:release/g) !== 1) {
        errors.push('release-artifact must run exactly one release proof')
      }
      if (!/archive="release-\$\{release_sha\}\.tar\.gz"/.test(block)) {
        errors.push('release-artifact must name the archive release-<sha>.tar.gz')
      }
      if (!/sha256sum "release-artifacts\/\$\{archive\}"/.test(block)) {
        errors.push('release-artifact must calculate the archive SHA-256 checksum')
      }
      if (!/release-artifacts\/manifest\.json/.test(block)) {
        errors.push('release-artifact must emit the release manifest')
      }
      if (!/artifacts:\r?\n\s+paths:\r?\n\s+- release-artifacts\//.test(block)) {
        errors.push('release-artifact must upload the release artifact directory once')
      }
      if (/\b(?:deploy|ssh|scp|rsync|kubectl)\b/i.test(block)) {
        errors.push('release-artifact must not contain deployment commands')
      }
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
                corepack pnpm verify
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
                corepack pnpm verify:release
  release-artifact:
    inputs:
      expected_commit_sha:
        required: true
    tasks:
      - name: release
        cubes:
          - name: static-site-release
            image: docker.io/library/node:${contract.nodeVersion}-alpine
            script:
              - |
                test "$SOURCECRAFT_EVENT" = "manual"
                test "$SOURCECRAFT_COMMIT_REF" = "refs/heads/main"
                test "$SOURCECRAFT_COMMIT_SHA" = "\${{ inputs.expected_commit_sha }}"
                EXPECTED_COMMIT_SHA="\${{ inputs.expected_commit_sha }}"
                export EXPECTED_COMMIT_SHA
                node scripts/verify-sourcecraft-head.mjs
                corepack prepare ${contract.packageManager} --activate
                node scripts/verify-runtime-versions.mjs
                corepack pnpm install --frozen-lockfile
                corepack pnpm verify:release
                release_sha="\${{ inputs.expected_commit_sha }}"
                archive="release-\${release_sha}.tar.gz"
                mkdir -p release-artifacts
                tar -czf "release-artifacts/\${archive}" -C out .
                checksum="$(sha256sum "release-artifacts/\${archive}" | awk '{print $1}')"
                printf '%s  %s\\n' "$checksum" "$archive" > "release-artifacts/\${archive}.sha256"
                printf '{}' > release-artifacts/manifest.json
            artifacts:
              paths:
                - release-artifacts/
`
}

async function runSelfTest() {
  const contract = await readRuntimeContract()
  const valid = buildValidFixture(contract)
  const cases = [
    ['valid baseline', valid, 0],
    ['automatic trigger', `on:\n  push:\n${valid}`, 2],
    ['floating node image', valid.replaceAll(`node:${contract.nodeVersion}-alpine`, 'node:24-alpine'), 3],
    ['missing frozen install', valid.replaceAll('corepack pnpm install --frozen-lockfile', 'corepack pnpm install'), 3],
    ['missing exact-head script', valid.replaceAll('node scripts/verify-sourcecraft-head.mjs', ''), 3],
    [
      'missing manual-event assertion',
      valid.replaceAll('test "$SOURCECRAFT_EVENT" = "manual"', ''),
      3,
    ],
    [
      'missing exact-SHA comparison',
      valid.replaceAll(
        'test "$SOURCECRAFT_COMMIT_SHA" = "${{ inputs.expected_commit_sha }}"',
        '',
      ),
      3,
    ],
    [
      'risky gate lacks release proof',
      valid.replace('corepack pnpm verify:release', 'corepack pnpm verify'),
      1,
    ],
    [
      'standard gate duplicates release proof',
      valid.replace('corepack pnpm verify\n  merge-risky:', 'corepack pnpm verify:release\n  merge-risky:'),
      2,
    ],
    [
      'release workflow is not exact-main',
      valid.replace('test "$SOURCECRAFT_COMMIT_REF" = "refs/heads/main"', ''),
      1,
    ],
    [
      'release archive has unstable name',
      valid.replace('archive="release-${release_sha}.tar.gz"', 'archive="release-latest.tar.gz"'),
      1,
    ],
    [
      'release checksum is missing',
      valid.replace('sha256sum "release-artifacts/${archive}"', 'cksum "release-artifacts/${archive}"'),
      1,
    ],
    [
      'release manifest is missing',
      valid.replace('release-artifacts/manifest.json', 'release-artifacts/metadata.json'),
      1,
    ],
    [
      'release artifact upload is missing',
      valid.replace('                - release-artifacts/', '                - missing-artifacts/'),
      1,
    ],
    [
      'release workflow attempts deployment',
      valid.replace('                tar -czf', '                rsync /tmp/remote\n                tar -czf'),
      1,
    ],
    [
      'wrong package manager activation',
      valid.replaceAll(`corepack prepare ${contract.packageManager} --activate`, `corepack prepare pnpm@${Number(contract.pnpmVersion.split('.')[0]) - 1}.0.0 --activate`),
      3,
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
