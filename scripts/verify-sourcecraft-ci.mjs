import { readFile } from 'node:fs/promises'
import path from 'node:path'

const ciPath = path.join(process.cwd(), '.sourcecraft', 'ci.yaml')

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

async function main() {
  const source = await readFile(ciPath, 'utf8')
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

  for (const workflow of ['merge-standard', 'merge-risky']) {
    if (!hasBlock(source, workflow)) {
      errors.push(`manual workflow is missing: ${workflow}`)
      continue
    }

    const block = source.match(
      new RegExp(`^  ${workflow}:\\r?\\n([\\s\\S]*?)(?=^  [a-zA-Z0-9_-]+:|(?![\\s\\S]))`, 'm'),
    )?.[1] ?? ''

    if (!/inputs:\r?\n[\s\S]*expected_commit_sha:\r?\n[\s\S]*required:\s*true/.test(block)) {
      errors.push(`${workflow} must require expected_commit_sha input`)
    }

    if (!/test "\$SOURCECRAFT_EVENT" = "manual"/.test(block)) {
      errors.push(`${workflow} must fail unless SOURCECRAFT_EVENT is manual`)
    }

    if (!/test "\$SOURCECRAFT_COMMIT_SHA" = "\$\{\{ inputs\.expected_commit_sha \}\}"/.test(block)) {
      errors.push(`${workflow} must compare SOURCECRAFT_COMMIT_SHA to expected_commit_sha`)
    }
  }

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
