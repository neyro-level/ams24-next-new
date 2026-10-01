import type { ProductDTO } from '@/core/content/schemas'
import type { LeadContext } from '@/core/content/services/lead-contract'

export type BlockRenderContext = {
  products: readonly ProductDTO[]
  lead: LeadContext
}
