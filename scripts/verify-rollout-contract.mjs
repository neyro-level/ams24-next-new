import { mkdtemp, mkdir, readFile, rename, rm, symlink, writeFile } from 'node:fs/promises'
import { existsSync, lstatSync, realpathSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const fullShaPattern = /^[a-f0-9]{40}$/
const releaseIdPattern = /^\d{8}T\d{6}Z-[a-f0-9]{12}$/
const forbiddenRollbackSteps = [/git\s+pull/i, /\bpnpm\s+install\b/i, /\bnpm\s+install\b/i, /\bnext\s+build\b/i]

async function createDirectoryLink(target, linkPath) {
  const linkType = process.platform === 'win32' ? 'junction' : 'dir'
  await symlink(target, linkPath, linkType)
}

function assertDirectoryLink(linkPath, expectedTarget) {
  if (!existsSync(linkPath)) {
    throw new Error(`${linkPath} does not exist`)
  }

  const stat = lstatSync(linkPath)
  if (!stat.isSymbolicLink()) {
    throw new Error(`${linkPath} must be a symlink/junction`)
  }

  const actual = realpathSync(linkPath)
  const expected = realpathSync(expectedTarget)
  if (actual !== expected) {
    throw new Error(`${linkPath} points to ${actual}, expected ${expected}`)
  }
}

async function switchCurrent(releasesRoot, releaseId) {
  if (!releaseIdPattern.test(releaseId)) {
    throw new Error(`release id must match ${releaseIdPattern}, got ${releaseId}`)
  }

  const releasePath = path.join(releasesRoot, releaseId)
  const artifactPath = path.join(releasePath, 'out', 'index.html')
  if (!existsSync(artifactPath)) {
    throw new Error(`release artifact is missing: ${artifactPath}`)
  }

  const currentPath = path.join(releasesRoot, 'current')
  const previousPath = path.join(releasesRoot, 'current.previous')
  const nextPath = path.join(releasesRoot, 'current.next')

  await rm(previousPath, { force: true, recursive: true })
  await rm(nextPath, { force: true, recursive: true })
  await createDirectoryLink(releasePath, nextPath)

  if (existsSync(currentPath)) {
    await rename(currentPath, previousPath)
  }
  await rename(nextPath, currentPath)
  assertDirectoryLink(currentPath, releasePath)

  await rm(previousPath, { force: true, recursive: true })

  return { currentPath, releasePath }
}

function assertRollbackSteps(steps) {
  for (const step of steps) {
    for (const pattern of forbiddenRollbackSteps) {
      if (pattern.test(step)) {
        throw new Error(`rollback step must not rebuild, install dependencies or pull Git: ${step}`)
      }
    }
  }

  if (!steps.some((step) => /switch\s+current/i.test(step))) {
    throw new Error('rollback steps must switch current')
  }

  if (!steps.some((step) => /smoke/i.test(step))) {
    throw new Error('rollback steps must include post-rollback smoke')
  }
}

async function createRelease(releasesRoot, releaseId, sha, html) {
  if (!fullShaPattern.test(sha)) {
    throw new Error(`release SHA must be a full lowercase Git SHA, got ${sha}`)
  }

  const outPath = path.join(releasesRoot, releaseId, 'out')
  await mkdir(outPath, { recursive: true })
  await writeFile(path.join(outPath, 'index.html'), html)
  await writeFile(
    path.join(releasesRoot, releaseId, 'release.json'),
    `${JSON.stringify({ releaseId, sha, artifact: 'out/' }, null, 2)}\n`,
  )
}

async function proveRolloutContract() {
  const sandbox = await mkdtemp(path.join(os.tmpdir(), 'ams24-rollout-'))
  try {
    const releasesRoot = path.join(sandbox, 'releases')
    await mkdir(releasesRoot, { recursive: true })

    const previousRelease = '20260930T120000Z-aaaaaaaaaaaa'
    const nextRelease = '20260930T130000Z-bbbbbbbbbbbb'
    const previousSha = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
    const nextSha = 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'

    await createRelease(releasesRoot, previousRelease, previousSha, '<h1>previous</h1>')
    await createRelease(releasesRoot, nextRelease, nextSha, '<h1>next</h1>')

    await switchCurrent(releasesRoot, previousRelease)
    assertDirectoryLink(path.join(releasesRoot, 'current'), path.join(releasesRoot, previousRelease))

    await switchCurrent(releasesRoot, nextRelease)
    assertDirectoryLink(path.join(releasesRoot, 'current'), path.join(releasesRoot, nextRelease))

    const currentHtml = await readFile(path.join(releasesRoot, 'current', 'out', 'index.html'), 'utf8')
    if (!currentHtml.includes('next')) {
      throw new Error('current must serve the switched release artifact')
    }

    assertRollbackSteps([
      'record current release id',
      'switch current to previous verified release',
      'reload nginx cache layer',
      'run post-rollback smoke checklist',
    ])

    await switchCurrent(releasesRoot, previousRelease)
    assertDirectoryLink(path.join(releasesRoot, 'current'), path.join(releasesRoot, previousRelease))

    const rollbackHtml = await readFile(path.join(releasesRoot, 'current', 'out', 'index.html'), 'utf8')
    if (!rollbackHtml.includes('previous')) {
      throw new Error('rollback must serve the previous verified release artifact')
    }
  } finally {
    await rm(sandbox, { force: true, recursive: true })
  }
}

async function runSelfTest() {
  const cases = [
    ['valid rollout and rollback', async () => proveRolloutContract(), true],
    ['invalid release id', async () => switchCurrent(os.tmpdir(), 'latest'), false],
    ['rollback rebuild command', async () => assertRollbackSteps(['switch current', 'pnpm install', 'smoke']), false],
    ['rollback missing smoke', async () => assertRollbackSteps(['switch current to previous release']), false],
  ]

  const failures = []
  for (const [name, run, shouldPass] of cases) {
    try {
      await run()
      if (!shouldPass) {
        failures.push(`${name}: expected failure, got pass`)
        continue
      }
      console.log(`Rollout contract self-test fixture "${name}": PASS`)
    } catch (error) {
      if (shouldPass) {
        failures.push(`${name}: expected pass, got ${error instanceof Error ? error.message : String(error)}`)
        continue
      }
      console.log(`Rollout contract self-test fixture "${name}": PASS (expected failure)`)
    }
  }

  if (failures.length > 0) {
    console.error('Rollout contract self-test: FAIL')
    for (const failure of failures) {
      console.error(`- ${failure}`)
    }
    process.exitCode = 1
    return
  }

  console.log('Rollout contract self-test: PASS')
}

async function main() {
  if (process.argv.includes('--self-test')) {
    await runSelfTest()
    return
  }

  try {
    await proveRolloutContract()
    console.log('Rollout contract: PASS')
  } catch (error) {
    console.error(`Rollout contract: FAIL — ${error instanceof Error ? error.message : String(error)}`)
    process.exitCode = 1
  }
}

await main()
