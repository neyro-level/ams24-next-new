import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { assertKnownBlockType, parsePageBlock, parsePageBlocks } from '@/core/content/block-registry'
import { RichText } from '@/core/content/services/rich-text'

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
