import { describe, expect, it } from 'vitest'

import { createContentRepository } from '@/core/content/repository'
import { assertValidContentGraph } from '@/core/content/validation'
import { localContent } from '@/project/content/local-content'
import { redirects } from '@/project/redirects'

describe('daily content graph verification', () => {
  it('invokes the canonical graph validator once for the current content graph', async () => {
    await expect(assertValidContentGraph(createContentRepository(localContent), { redirects })).resolves.toBeUndefined()
  })
})
