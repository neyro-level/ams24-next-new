import { createElement, type ComponentType, type ReactNode } from 'react'
import { z } from 'zod'

import {
  heroPageBlockSchema,
  leadFormShellPageBlockSchema,
  productRoutesPageBlockSchema,
  richTextPageBlockSchema,
  type PageBlockDTO,
} from '@/core/content/schemas'
import { HeroBlock } from '@/ui/blocks/hero-block'
import { LeadFormShellBlock } from '@/ui/blocks/lead-form-shell-block'
import { ProductRoutesBlock } from '@/ui/blocks/product-routes-block'
import { RichTextBlock } from '@/ui/blocks/rich-text-block'
import type { BlockRenderContext } from '@/ui/blocks/context'

export type BlockType = PageBlockDTO['blockType']
type BlockDTO<Type extends BlockType> = Extract<PageBlockDTO, { blockType: Type }>
type BlockComponent<Type extends BlockType> = ComponentType<{
  block: BlockDTO<Type>
  context: BlockRenderContext
}>

type BlockDefinition<Type extends BlockType> = {
  schema: z.ZodType<BlockDTO<Type>>
  component: BlockComponent<Type>
}

export const blockRegistry = Object.freeze({
  hero: {
    schema: heroPageBlockSchema,
    component: HeroBlock,
  },
  'product-routes': {
    schema: productRoutesPageBlockSchema,
    component: ProductRoutesBlock,
  },
  'rich-text': {
    schema: richTextPageBlockSchema,
    component: RichTextBlock,
  },
  'lead-form-shell': {
    schema: leadFormShellPageBlockSchema,
    component: LeadFormShellBlock,
  },
} satisfies { [Type in BlockType]: BlockDefinition<Type> })

export const blockTypes = Object.freeze(Object.keys(blockRegistry) as BlockType[])

function readBlockType(input: unknown): string {
  if (typeof input !== 'object' || input === null || !('blockType' in input)) {
    throw new Error('Page block must include a string blockType.')
  }

  const blockType = (input as { blockType?: unknown }).blockType

  if (typeof blockType !== 'string') {
    throw new Error('Page block must include a string blockType.')
  }

  return blockType
}

export function assertKnownBlockType(blockType: string): asserts blockType is BlockType {
  if (!Object.hasOwn(blockRegistry, blockType)) {
    throw new Error(`Unknown or unimplemented page block type: ${blockType}`)
  }
}

export function parsePageBlock(input: unknown): PageBlockDTO {
  const blockType = readBlockType(input)
  assertKnownBlockType(blockType)

  return blockRegistry[blockType].schema.parse(input) as PageBlockDTO
}

export function parsePageBlocks(input: unknown): PageBlockDTO[] {
  return z.array(z.unknown()).parse(input).map(parsePageBlock)
}

export function renderPageBlock(
  input: unknown,
  context: BlockRenderContext,
  key?: string | number,
): ReactNode {
  const block = parsePageBlock(input)
  const definition = blockRegistry[block.blockType]
  const Component = definition.component as ComponentType<{
    block: PageBlockDTO
    context: BlockRenderContext
  }>

  return createElement(Component, { block, context, key })
}

export function PageBlocks({
  blocks,
  context,
}: {
  blocks: readonly PageBlockDTO[]
  context: BlockRenderContext
}) {
  return <>{blocks.map((block, index) => renderPageBlock(block, context, `${block.blockType}-${index}`))}</>
}

export type { BlockRenderContext } from '@/ui/blocks/context'
