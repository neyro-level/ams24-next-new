import type { ProductDTO } from '@/core/content/schemas'
import type { LeadContext } from '@/core/leads'

export type BlockRenderContext = {
  products: readonly ProductDTO[]
  lead: LeadContext
}
