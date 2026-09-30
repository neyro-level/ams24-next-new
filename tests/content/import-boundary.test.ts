import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

import { describe, expect, it } from 'vitest'

const runtimeRoots = ['src/app', 'src/ui'] as const

function collectSourceFiles(root: string): string[] {
  const files: string[] = []

  for (const entry of readdirSync(root)) {
    const path = join(root, entry)
    const stat = statSync(path)

    if (stat.isDirectory()) {
      files.push(...collectSourceFiles(path))
      continue
    }

    if (/\.(ts|tsx)$/.test(entry)) {
      files.push(path)
    }
  }

  return files
}

describe('runtime content boundary', () => {
  it('keeps app and UI runtime code behind content services instead of project implementations', () => {
    const offenders = runtimeRoots.flatMap((root) =>
      collectSourceFiles(root).flatMap((file) => {
        const source = readFileSync(file, 'utf8')

        return source.includes('@/project/')
          ? [relative(process.cwd(), file).replaceAll('\\', '/')]
          : []
      }),
    )

    expect(offenders).toEqual([])
  })
})
