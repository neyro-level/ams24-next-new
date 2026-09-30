import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

const projectRoot = process.cwd()
const requiredNodeVersion = '24.20.0'
const requiredPnpmVersion = '12.8.1'

async function readText(root, relativePath, errors) {
  try {
    return await readFile(path.join(root, relativePath), 'utf8')
  } catch {
    errors.push(`${relativePath} is required for runtime version verification`)
    return ''
  }
}

function parsePackageManager(packageJsonSource, errors) {
  try {
    const packageJson = JSON.parse(packageJsonSource)
    return String(packageJson.packageManager ?? '')
  } catch (error) {
    errors.push(`package.json must be valid JSON: ${error.message}`)
    return ''
  }
}

function readActualPnpmVersion() {
  if (process.platform === 'win32') {
    return execFileSync('cmd.exe', ['/d', '/s', '/c', 'corepack pnpm -v'], { encoding: 'utf8' }).trim()
  }

  return execFileSync('corepack', ['pnpm', '-v'], { encoding: 'utf8' }).trim()
}

export async function checkRuntimeVersions(
  root,
  {
    actualNodeVersion = process.version.replace(/^v/, ''),
    actualPnpmVersion = readActualPnpmVersion(),
  } = {},
) {
  const errors = []
  const nodeVersion = (await readText(root, '.node-version', errors)).trim()
  const packageManager = parsePackageManager(await readText(root, 'package.json', errors), errors)

  if (nodeVersion && nodeVersion !== requiredNodeVersion) {
    errors.push(`.node-version must be ${requiredNodeVersion}, got ${nodeVersion}`)
  }

  if (packageManager && packageManager !== `pnpm@${requiredPnpmVersion}`) {
    errors.push(`package.json packageManager must be pnpm@${requiredPnpmVersion}, got ${packageManager}`)
  }

  if (actualNodeVersion !== requiredNodeVersion) {
    errors.push(`current Node.js must be ${requiredNodeVersion}, got ${actualNodeVersion}`)
  }

  if (actualPnpmVersion !== requiredPnpmVersion) {
    errors.push(`current pnpm must be ${requiredPnpmVersion}, got ${actualPnpmVersion}`)
  }

  return errors
}

async function runSelfTest() {
  const fixtureRoot = mkdtempSync(path.join(tmpdir(), 'ams-runtime-version-guard-'))

  try {
    const validRoot = path.join(fixtureRoot, 'valid')
    const wrongNodeRoot = path.join(fixtureRoot, 'wrong-node')
    const wrongPnpmRoot = path.join(fixtureRoot, 'wrong-pnpm')

    for (const root of [validRoot, wrongNodeRoot, wrongPnpmRoot]) {
      mkdirSync(root, { recursive: true })
    }

    writeFileSync(path.join(validRoot, '.node-version'), `${requiredNodeVersion}\n`)
    writeFileSync(path.join(validRoot, 'package.json'), JSON.stringify({ packageManager: `pnpm@${requiredPnpmVersion}` }))

    writeFileSync(path.join(wrongNodeRoot, '.node-version'), '24.19.0\n')
    writeFileSync(path.join(wrongNodeRoot, 'package.json'), JSON.stringify({ packageManager: `pnpm@${requiredPnpmVersion}` }))

    writeFileSync(path.join(wrongPnpmRoot, '.node-version'), `${requiredNodeVersion}\n`)
    writeFileSync(path.join(wrongPnpmRoot, 'package.json'), JSON.stringify({ packageManager: 'pnpm@12.7.0' }))

    const validErrors = await checkRuntimeVersions(validRoot, {
      actualNodeVersion: requiredNodeVersion,
      actualPnpmVersion: requiredPnpmVersion,
    })
    const wrongNodeErrors = await checkRuntimeVersions(wrongNodeRoot, {
      actualNodeVersion: '24.19.0',
      actualPnpmVersion: requiredPnpmVersion,
    })
    const wrongPnpmErrors = await checkRuntimeVersions(wrongPnpmRoot, {
      actualNodeVersion: requiredNodeVersion,
      actualPnpmVersion: '12.7.0',
    })

    if (validErrors.length > 0) {
      throw new Error(`Runtime version self-test valid fixture failed: ${validErrors.join('; ')}`)
    }

    for (const expected of ['.node-version must be 24.20.0', 'current Node.js must be 24.20.0']) {
      if (!wrongNodeErrors.some((error) => error.includes(expected))) {
        throw new Error(`Runtime version self-test missed wrong node fixture: ${wrongNodeErrors.join('; ')}`)
      }
    }

    for (const expected of ['packageManager must be pnpm@12.8.1', 'current pnpm must be 12.8.1']) {
      if (!wrongPnpmErrors.some((error) => error.includes(expected))) {
        throw new Error(`Runtime version self-test missed wrong pnpm fixture: ${wrongPnpmErrors.join('; ')}`)
      }
    }

    console.log('Runtime version guard self-test: PASS')
  } finally {
    rmSync(fixtureRoot, { force: true, recursive: true })
  }
}

async function main() {
  if (process.argv.includes('--self-test')) {
    await runSelfTest()
    return
  }

  const errors = await checkRuntimeVersions(projectRoot)

  if (errors.length > 0) {
    console.error('Runtime version guard: FAIL')
    for (const error of errors) {
      console.error(`- ${error}`)
    }
    process.exitCode = 1
    return
  }

  console.log(`Runtime version guard: PASS (node ${requiredNodeVersion}, pnpm ${requiredPnpmVersion})`)
}

await main()
