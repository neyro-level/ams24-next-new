import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

const fullShaPattern = /^[a-f0-9]{40}$/

function fail(message) {
  console.error(`SourceCraft exact-head guard: FAIL — ${message}`)
  process.exitCode = 1
}

function readGitDirectory() {
  const dotGitPath = path.join(process.cwd(), '.git')

  if (!existsSync(dotGitPath)) {
    throw new Error('.git is missing')
  }

  const dotGitContent = readFileSync(dotGitPath, 'utf8').trim()

  if (dotGitContent.startsWith('gitdir:')) {
    return path.resolve(process.cwd(), dotGitContent.slice('gitdir:'.length).trim())
  }

  return dotGitPath
}

function readGitHeadSha() {
  const gitDirectory = readGitDirectory()
  const head = readFileSync(path.join(gitDirectory, 'HEAD'), 'utf8').trim()

  if (fullShaPattern.test(head)) {
    return head
  }

  if (!head.startsWith('ref: ')) {
    throw new Error(`unsupported HEAD format: ${head}`)
  }

  const refName = head.slice('ref: '.length).trim()
  const refPath = path.join(gitDirectory, refName)

  if (existsSync(refPath)) {
    return readFileSync(refPath, 'utf8').trim()
  }

  const packedRefsPath = path.join(gitDirectory, 'packed-refs')
  if (existsSync(packedRefsPath)) {
    const packedRef = readFileSync(packedRefsPath, 'utf8')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .find((line) => line && !line.startsWith('#') && line.endsWith(` ${refName}`))

    if (packedRef) {
      return packedRef.split(/\s+/)[0]
    }
  }

  throw new Error(`unable to resolve HEAD ref ${refName}`)
}

const expectedCommitSha = process.env.EXPECTED_COMMIT_SHA
const sourcecraftCommitSha = process.env.SOURCECRAFT_COMMIT_SHA

if (!expectedCommitSha || !fullShaPattern.test(expectedCommitSha)) {
  fail('EXPECTED_COMMIT_SHA must be a full lowercase Git SHA')
} else if (sourcecraftCommitSha !== expectedCommitSha) {
  fail('SOURCECRAFT_COMMIT_SHA differs from EXPECTED_COMMIT_SHA')
} else {
  try {
    const actualHeadSha = readGitHeadSha()

    if (actualHeadSha !== expectedCommitSha) {
      fail('checked-out Git HEAD differs from EXPECTED_COMMIT_SHA')
    } else {
      console.log(`SourceCraft exact-head guard: PASS (${actualHeadSha})`)
    }
  } catch (error) {
    fail(error instanceof Error ? error.message : String(error))
  }
}
