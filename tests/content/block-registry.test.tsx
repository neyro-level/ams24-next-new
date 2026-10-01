import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { richTextSchema } from '@/core/content/schemas'
import { getContentRepository } from '@/core/content/services/repository'
import {
  assertKnownBlockType,
  blockRegistry,
  blockTypes,
  PageBlocks,
  parsePageBlock,
  parsePageBlocks,
  renderPageBlock,
} from '@/ui/blocks'
import { RichText } from '@/ui/content/rich-text'

const blockFixtures = {
  hero: {
    blockType: 'hero',
    title: 'Импульс',
    lead: 'Единая платформа для привлечения, определения и защиты лидов.',
  },
  'product-routes': {
    blockType: 'product-routes',
    productRefs: ['impuls', 'pixel', 'zashchita'],
  },
  'rich-text': {
    blockType: 'rich-text',
    body: {
      format: 'markdown',
      value: '## Содержание',
    },
  },
  'lead-form-shell': {
    blockType: 'lead-form-shell',
    intentId: 'home-final-calc',
  },
} as const

async function getRenderContext() {
  return {
    products: await getContentRepository().getProducts(),
    lead: {
      product: 'site' as const,
      route: '/',
      ctaId: 'page-block',
    },
  }
}

describe('executable page block registry', () => {
  it('parses known blocks through their registry schemas and hard-fails unknown blocks', () => {
    expect(parsePageBlock(blockFixtures.hero)).toMatchObject({ blockType: 'hero' })
    expect(() => parsePageBlock({ blockType: 'unknown-block' })).toThrow(
      /Unknown or unimplemented page block type/,
    )
    expect(() => assertKnownBlockType('unknown-block')).toThrow(/Unknown or unimplemented page block type/)
    expect(() => parsePageBlock({ type: 'hero' })).toThrow(/string blockType/)
  })

  it('maps every schema block type to a Zod schema and a real React component', () => {
    expect(Object.keys(blockRegistry).sort()).toEqual([...blockTypes].sort())
    expect(blockTypes).toEqual(['hero', 'product-routes', 'rich-text', 'lead-form-shell'])

    for (const blockType of blockTypes) {
      const definition = blockRegistry[blockType]

      expect(typeof definition.component).toBe('function')
      expect(definition.schema.parse(blockFixtures[blockType])).toBeDefined()
    }
  })

  it('parses and renders every registered block, including rich text', async () => {
    const blocks = parsePageBlocks(Object.values(blockFixtures))
    const renderContext = await getRenderContext()
    const html = renderToStaticMarkup(<PageBlocks blocks={blocks} context={renderContext} />)

    expect(blocks.map((block) => block.blockType)).toEqual(blockTypes)
    expect(html).toContain('Импульс')
    expect(html).toContain('href="/pixel"')
    expect(html).toContain('data-rich-text')
    expect(html).toContain('data-form-id')
  })

  it('rejects malformed registered blocks before component execution', async () => {
    const renderContext = await getRenderContext()
    expect(() =>
      renderPageBlock({ blockType: 'rich-text', body: { format: 'markdown' } }, renderContext),
    ).toThrow()
    expect(() => renderPageBlock({ blockType: 'missing' }, renderContext)).toThrow(/Unknown or unimplemented/)
  })

  it('renders markdown without raw arbitrary HTML execution', () => {
    const html = renderToStaticMarkup(
      <RichText
        content={{
          format: 'markdown',
          value: '# Заголовок\n\n<script>alert("x")</script>\n\n- Один\n- Два',
        }}
      />,
    )

    expect(html).toContain('<h2>Заголовок</h2>')
    expect(html).toContain('&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;')
    expect(html).not.toContain('<script>')
    expect(html).toContain('<li>Один</li>')
  })

  it('uses Next links internally and safe anchors externally', () => {
    const html = renderToStaticMarkup(
      <RichText
        content={{
          format: 'markdown',
          value: '[Внутренняя](/impuls/) и [внешняя](https://example.com/path).',
        }}
      />,
    )

    expect(html).toContain('href="/impuls"')
    expect(html).toContain('href="https://example.com/path"')
    expect(html).toContain('rel="noopener noreferrer"')
  })

  it('rejects malformed or unsupported links during content parsing', () => {
    expect(() => richTextSchema.parse({ format: 'markdown', value: '[Bad](javascript:alert)' })).toThrow(/unsupported URL/)
    expect(() => richTextSchema.parse({ format: 'markdown', value: '[Bad](not a url)' })).toThrow(/malformed link/)
    expect(() => richTextSchema.parse({ format: 'markdown', value: '[Bad](//evil.example)' })).toThrow(/canonical internal path/)
  })

  it('fails explicitly until a lexical renderer exists', () => {
    expect(() => renderToStaticMarkup(<RichText content={{ format: 'lexical', value: {} }} />)).toThrow(
      /Unsupported RichText renderer: lexical requires the Payload renderer/,
    )
  })
})
