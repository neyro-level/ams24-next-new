import { z } from 'zod'

import { pageBlockSchema, type PageBlockDTO } from '@/core/content/schemas'

export const blockTypes = ['hero', 'product-routes', 'rich-text', 'lead-form-shell'] as const

export type BlockType = (typeof blockTypes)[number]

export const blockRegistry = Object.freeze(
  Object.fromEntries(blockTypes.map((type) => [type, { type }])) as Record<
    BlockType,
    { type: BlockType }
  >,
)

export function parsePageBlock(input: unknown): PageBlockDTO {
  return pageBlockSchema.parse(input)
}

export function parsePageBlocks(input: unknown): PageBlockDTO[] {
  return z.array(pageBlockSchema).parse(input)
}

export function assertKnownBlockType(type: string): asserts type is BlockType {
  if (!Object.hasOwn(blockRegistry, type)) {
    throw new Error(`Unknown page block type: ${type}`)
  }
}
