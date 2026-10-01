import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

const richTextDtoPattern = /(?:export\s+type\s+RichTextDTO|type\s+RichTextDTO|interface\s+RichTextDTO)/g
const richTextRendererPattern = /export\s+function\s+RichText\(/g

const contractFiles = [
  'src/core/content/schemas/common.ts',
  'src/ui/content/rich-text.tsx',
  'src/project/editorial-contracts.ts',
  'src/ui/content/article-editorial-template.tsx',
  'src/ui/content/knowledge-editorial-template.tsx',
] as const

describe('CR-12.3 RichText contract', () => {
  it('keeps a single RichText DTO and a single RichText renderer', () => {
    const sources = contractFiles.map((file) => readFileSync(join(process.cwd(), file), 'utf8'))
    const richTextDtoMatches = sources.flatMap((source) => source.match(richTextDtoPattern) ?? [])
    const richTextRendererMatches = sources.flatMap((source) => source.match(richTextRendererPattern) ?? [])

    expect(richTextDtoMatches).toHaveLength(1)
    expect(richTextRendererMatches).toHaveLength(1)
  })

  it('routes real editorial templates through the shared renderer', () => {
    const articleTemplate = readFileSync(join(process.cwd(), 'src/ui/content/article-editorial-template.tsx'), 'utf8')
    const knowledgeTemplate = readFileSync(join(process.cwd(), 'src/ui/content/knowledge-editorial-template.tsx'), 'utf8')

    expect(articleTemplate).toContain("import { RichText } from '@/ui/content/rich-text'")
    expect(articleTemplate).toContain('<RichText content={article.body} />')
    expect(knowledgeTemplate).toContain("import { RichText } from '@/ui/content/rich-text'")
    expect(knowledgeTemplate).toContain('<RichText content={contract.body} />')
  })

  it('keeps renderer ownership in UI and structural list keys independent of text', () => {
    const renderer = readFileSync(join(process.cwd(), 'src/ui/content/rich-text.tsx'), 'utf8')

    expect(renderer).toContain("import Link from 'next/link'")
    expect(renderer).toContain('key={`${blockIndex}-${itemIndex}`}')
    expect(renderer).not.toContain('key={line}')
    expect(renderer).not.toContain("href : '#'")
  })
})
