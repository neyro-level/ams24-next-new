import { describe, expect, it } from 'vitest'

import { createContentRepository } from '@/core/content/repository'
import { validateContentGraph } from '@/core/content/validation'
import { localContent } from '@/project/content/local-content'

describe('editorial related-content graph', () => {
  it('has no broken links, orphan products, duplicate intent or unsupported topic hubs', async () => {
    const repository = createContentRepository(localContent)

    await expect(validateContentGraph(repository)).resolves.toEqual([])
  })

  it('detects broken links and duplicate article intent', async () => {
    const repository = createContentRepository({
      ...localContent,
      articles: [
        ...localContent.articles!,
        {
          ...localContent.articles![0],
          id: 'article-duplicate-intent',
          path: '/stati/duplicate-intent/',
          slug: 'duplicate-intent',
          body: {
            format: 'markdown',
            value: '[Broken](/missing-page/)',
          },
        },
      ],
    })

    await expect(validateContentGraph(repository)).resolves.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: 'duplicate-intent' }),
        expect.objectContaining({ code: 'broken-link' }),
      ]),
    )
  })
})
