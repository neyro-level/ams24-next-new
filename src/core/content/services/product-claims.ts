import type { ProductId } from '@/core/content/schemas'
import {
  getPublicClaimsForProduct as selectPublicClaimsForProduct,
  type ProductClaim as ProjectProductClaim,
} from '@/project/product-claims'

export type ProductClaim = ProjectProductClaim

export function getPublicClaimsForProduct(product: ProductId) {
  return selectPublicClaimsForProduct(product)
}
