import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import {
  assertKnownBlockType,
  assertSupportedBlockType,
  parsePageBlock,
  parsePageBlocks,
  parseSupportedPageBlock,
  parseSupportedPageBlocks,
  schemaOnlyBlockTypes,
  supportedBlockRegistry,
  supportedBlockTypes,
} from '@/core/content/block-registry'
import { RichText } from '@/core/content/services/rich-text'

const supportedBlockFixtures = {
  hero: {
    type: 'hero',
    title: 'Импульс',
    lead: 'Единая платформа для привлечения, определения и защиты лидов.',
  },
  'product-routes': {
    type: 'product-routes',
    productRefs: ['impuls', 'pixel', 'zashchita'],
  },
  'lead-form-shell': {
    type: 'lead-form-shell',
    intentId: 'home-final-calc',
  },
} as const

describe('block registry and RichText', () => {
  it('parses known blocks and hard-fails unknown blocks', () => {
    expect(
      parsePageBlock({
        type: 'hero',
        title: 'Импульс',
        lead: 'Единая платформа для привлечения, определения и защиты лидов.',
      }),
    ).toMatchObject({ type: 'hero' })

    expect(() => parsePageBlock({ type: 'unknown-block' })).toThrow()
    expect(() => assertKnownBlockType('unknown-block')).toThrow(/Unknown page block type/)
  })

  it('maps every supported block type to a schema and component key', () => {
    expect(Object.keys(supportedBlockRegistry).sort()).toEqual([...supportedBlockTypes].sort())

    for (const type of supportedBlockTypes) {
      const definition = supportedBlockRegistry[type]

      expect(definition.type).toBe(type)
      expect(definition.component).toMatch(/Block$/)
      expect(definition.schema.parse(supportedBlockFixtures[type])).toBeDefined()
    }
  })

  it('parses a typed block list', () => {
    const blocks = parsePageBlocks([
      {
        type: 'product-routes',
        productRefs: ['impuls', 'pixel', 'zashchita'],
      },
      {
        type: 'lead-form-shell',
        intentId: 'home-final-calc',
      },
    ])

    expect(blocks).toHaveLength(2)
  })

  it('parses only currently supported blocks through the schema-to-component registry', () => {
    const blocks = parseSupportedPageBlocks([
      {
        type: 'hero',
        title: 'Импульс',
        lead: 'Единая платформа для привлечения, определения и защиты лидов.',
      },
      {
        type: 'product-routes',
        productRefs: ['impuls', 'pixel', 'zashchita'],
      },
      {
        type: 'lead-form-shell',
        intentId: 'home-final-calc',
      },
    ])

    expect(blocks.map((block) => block.type)).toEqual(['hero', 'product-routes', 'lead-form-shell'])
  })

  it('keeps schema-only block formats out of the supported component registry', () => {
    expect(schemaOnlyBlockTypes).toEqual(['rich-text'])
    expect(() =>
      parseSupportedPageBlock({
        type: 'rich-text',
        body: {
          kind: 'markdown',
          value: 'Schema-only page RichText block.',
        },
      }),
    ).toThrow(/Unsupported page block type/)
    expect(() => assertSupportedBlockType('rich-text')).toThrow(/Unsupported page block type/)
    expect(() => parseSupportedPageBlock({ type: 'unknown-block' })).toThrow(/Unknown page block type/)
  })

  it('renders markdown without raw arbitrary HTML execution', () => {
    const html = renderToStaticMarkup(
      <RichText
        content={{
          kind: 'markdown',
          value: '# Заголовок\n\n<script>alert("x")</script>\n\n- Один\n- Два',
        }}
      />,
    )

    expect(html).toContain('<h2>Заголовок</h2>')
    expect(html).toContain('&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;')
    expect(html).not.toContain('<script>')
    expect(html).toContain('<li>Один</li>')
  })
})
