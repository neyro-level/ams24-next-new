import { z } from 'zod'

import {
  heroPageBlockSchema,
  leadFormShellPageBlockSchema,
  pageBlockSchema,
  productRoutesPageBlockSchema,
  type PageBlockDTO,
} from '@/core/content/schemas'

export const blockTypes = ['hero', 'product-routes', 'rich-text', 'lead-form-shell'] as const
export const supportedBlockTypes = ['hero', 'product-routes', 'lead-form-shell'] as const
export const schemaOnlyBlockTypes = ['rich-text'] as const

export type BlockType = (typeof blockTypes)[number]
export type SupportedBlockType = (typeof supportedBlockTypes)[number]
export type SupportedPageBlockDTO = Extract<PageBlockDTO, { type: SupportedBlockType }>

type BlockDefinition<Type extends SupportedBlockType> = {
  type: Type
  schema: z.ZodType<Extract<PageBlockDTO, { type: Type }>>
  component: `${string}Block`
}

export const blockRegistry = Object.freeze(
  Object.fromEntries(blockTypes.map((type) => [type, { type }])) as Record<
    BlockType,
    { type: BlockType }
  >,
)

export const supportedBlockRegistry = Object.freeze({
  hero: {
    type: 'hero',
    schema: heroPageBlockSchema,
    component: 'HeroBlock',
  },
  'product-routes': {
    type: 'product-routes',
    schema: productRoutesPageBlockSchema,
    component: 'ProductRoutesBlock',
  },
  'lead-form-shell': {
    type: 'lead-form-shell',
    schema: leadFormShellPageBlockSchema,
    component: 'LeadFormShellBlock',
  },
} satisfies {
  [Type in SupportedBlockType]: BlockDefinition<Type>
})

export function parsePageBlock(input: unknown): PageBlockDTO {
  return pageBlockSchema.parse(input)
}

export function parsePageBlocks(input: unknown): PageBlockDTO[] {
  return z.array(pageBlockSchema).parse(input)
}

export function parseSupportedPageBlock(input: unknown): SupportedPageBlockDTO {
  const candidateType =
    typeof input === 'object' && input !== null && 'type' in input
      ? (input as { type?: unknown }).type
      : undefined

  if (typeof candidateType !== 'string') {
    throw new Error('Page block must include a string type.')
  }

  assertSupportedBlockType(candidateType)

  return supportedBlockRegistry[candidateType].schema.parse(input)
}

export function parseSupportedPageBlocks(input: unknown): SupportedPageBlockDTO[] {
  return z.array(z.unknown()).parse(input).map(parseSupportedPageBlock)
}

export function assertKnownBlockType(type: string): asserts type is BlockType {
  if (!Object.hasOwn(blockRegistry, type)) {
    throw new Error(`Unknown page block type: ${type}`)
  }
}

export function assertSupportedBlockType(type: string): asserts type is SupportedBlockType {
  assertKnownBlockType(type)

  if (!Object.hasOwn(supportedBlockRegistry, type)) {
    throw new Error(`Unsupported page block type without reachable component: ${type}`)
  }
}
