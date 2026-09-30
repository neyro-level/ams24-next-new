import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

import { describe, expect, it } from 'vitest'

import { createContentRepository } from '@/core/content/repository'
import {
  assertValidContentGraph,
  validateContentGraph,
} from '@/core/content/validation'
import { localContent } from '@/project/content/local-content'

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

describe('content graph validator contract', () => {
  it('exposes one canonical validator API for valid repository content', () => {
    const repository = createContentRepository(localContent)

    expect(validateContentGraph(repository)).toEqual([])
    expect(() => assertValidContentGraph(repository)).not.toThrow()
  })

  it('reports cross-entity graph issues without throwing in report mode', () => {
    const repository = createContentRepository({
      ...localContent,
      articles: [
        ...localContent.articles!.filter((article) => article.productRefs.includes('pixel')),
        {
          ...localContent.articles![0],
          id: 'article-duplicate-intent',
          path: '/stati/duplicate-intent/',
          slug: 'duplicate-intent',
          body: {
            kind: 'markdown',
            value: '[Broken](/missing-page/)',
          },
        },
      ],
    })

    expect(validateContentGraph(repository)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: 'broken-link', entity: 'article:article-duplicate-intent' }),
        expect.objectContaining({ code: 'orphan-product', entity: 'product:zashchita' }),
      ]),
    )
  })

  it('keeps graph-validation ownership inside core/content/validation', () => {
    const offenders = collectSourceFiles('src').flatMap((file) => {
      const normalized = relative(process.cwd(), file).replaceAll('\\', '/')
      const source = readFileSync(file, 'utf8')
      const declaresGraphValidator = /function\s+validate[A-Za-z]*Graph\b/.test(source)

      return declaresGraphValidator && !normalized.startsWith('src/core/content/validation/')
        ? [normalized]
        : []
    })

    expect(offenders).toEqual([])
  })
})
