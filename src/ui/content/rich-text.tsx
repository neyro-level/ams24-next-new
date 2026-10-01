import Link from 'next/link'
import type { ReactNode } from 'react'

import type { RichTextDTO } from '@/core/content/schemas'

function renderInline(text: string) {
  const linkPattern = /\[([^\]]+)\]\(([^)\s]+)\)/g
  const nodes: ReactNode[] = []
  let cursor = 0
  let match: RegExpExecArray | null

  while ((match = linkPattern.exec(text))) {
    const [raw, label, href] = match
    if (match.index > cursor) nodes.push(text.slice(cursor, match.index))

    const className = 'underline underline-offset-4'
    nodes.push(
      href.startsWith('/') ? (
        <Link className={className} href={href} key={`link-${match.index}`}>
          {label}
        </Link>
      ) : (
        <a className={className} href={href} key={`link-${match.index}`} rel="noopener noreferrer">
          {label}
        </a>
      ),
    )
    cursor = match.index + raw.length
  }

  if (cursor < text.length) nodes.push(text.slice(cursor))
  return nodes.length > 0 ? nodes : text
}

function renderMarkdown(markdown: string) {
  const blocks = markdown.trim().split(/\n{2,}/).map((block) => block.trim()).filter(Boolean)

  return blocks.map((block, blockIndex) => {
    if (block.startsWith('### ')) return <h3 key={blockIndex}>{renderInline(block.slice(4))}</h3>
    if (block.startsWith('## ')) return <h2 key={blockIndex}>{renderInline(block.slice(3))}</h2>
    if (block.startsWith('# ')) return <h2 key={blockIndex}>{renderInline(block.slice(2))}</h2>

    if (block.split('\n').every((line) => line.startsWith('- '))) {
      return (
        <ul key={blockIndex}>
          {block.split('\n').map((line, itemIndex) => (
            <li key={`${blockIndex}-${itemIndex}`}>{renderInline(line.slice(2))}</li>
          ))}
        </ul>
      )
    }

    return <p key={blockIndex}>{renderInline(block.replace(/\n/g, ' '))}</p>
  })
}

export function RichText({ content }: { content: RichTextDTO }) {
  if (content.format === 'lexical') {
    throw new Error('Unsupported RichText renderer: lexical requires the Payload renderer')
  }

  return <div data-rich-text="">{renderMarkdown(content.value)}</div>
}
