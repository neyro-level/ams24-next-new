import { describe, expect, it } from 'vitest'

import { createContentRepository } from '@/core/content/repository'
import { validateEditorialLinkGraph } from '@/project/editorial-link-graph'
import { localContent } from '@/project/content/local-content'

describe('editorial related-content graph', () => {
  it('has no broken links, orphan products, duplicate intent or unsupported topic hubs', () => {
    const repository = createContentRepository(localContent)

    expect(validateEditorialLinkGraph(repository)).toEqual([])
  })

  it('detects broken links and duplicate article intent', () => {
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
            kind: 'markdown',
            value: '[Broken](/missing-page/)',
          },
        },
      ],
    })

    expect(validateEditorialLinkGraph(repository)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: 'duplicate-intent' }),
        expect.objectContaining({ code: 'broken-link' }),
      ]),
    )
  })
})
