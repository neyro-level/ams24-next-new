import {
  getPublicClaimsForProduct as selectPublicClaimsForProduct,
  type ClaimProductId,
  type ProductClaim as ProjectProductClaim,
} from '@/project/product-claims'

export type ProductClaim = ProjectProductClaim

export function getPublicClaimsForProduct(product: ClaimProductId) {
  return selectPublicClaimsForProduct(product)
}
