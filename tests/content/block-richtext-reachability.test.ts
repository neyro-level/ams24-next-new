import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { blockTypes } from '@/ui/blocks'
import { localContent } from '@/project/content/local-content'

const inventoryPath = join(process.cwd(), 'docs/research/BLOCK_RICHTEXT_REACHABILITY_INVENTORY_CR_12_1.md')

const expectedReachablePageBlocks = ['hero', 'lead-form-shell', 'product-routes'] as const
const expectedReachableRichTextKinds = ['markdown'] as const

describe('CR-12.1 block/RichText reachability inventory', () => {
  const inventory = readFileSync(inventoryPath, 'utf8')

  it('matches the current reachable page block types', () => {
    const reachable = new Set<string>(localContent.pages.flatMap((page) => page.blocks.map((block) => block.blockType)))

    expect([...reachable].sort()).toEqual([...expectedReachablePageBlocks].sort())
    expect(reachable.has('rich-text')).toBe(false)
    expect(blockTypes).toContain('rich-text')
  })

  it('matches the current reachable RichText body kinds', () => {
    const articleKinds = localContent.articles.map((article) => article.body.format)
    const knowledgeKinds = localContent.knowledgeArticles.map((article) => article.body.format)
    const reachable = new Set<string>([...articleKinds, ...knowledgeKinds])

    expect([...reachable].sort()).toEqual([...expectedReachableRichTextKinds].sort())
    expect(reachable.has('blocks')).toBe(false)
  })

  it('documents reachable and speculative formats explicitly', () => {
    for (const blockType of [...expectedReachablePageBlocks, 'rich-text']) {
      expect(inventory).toContain(`\`${blockType}\``)
    }

    for (const kind of [...expectedReachableRichTextKinds, 'lexical']) {
      expect(inventory).toContain(`\`${kind}\``)
    }

    for (const speculativeFormat of ['Lexical JSON', 'MDX', 'tables', 'images/media blocks', 'unknown block passthrough']) {
      expect(inventory).toContain(speculativeFormat)
    }
  })
})
