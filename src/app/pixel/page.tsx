import { getProductPageContent } from '@/core/content/services/product-pages'
import { getPublicClaimsForProduct } from '@/core/content/services/product-claims'
import { getContentRepository } from '@/core/content/services/repository'
import { getRequiredSiteSettings } from '@/core/content/services/site-settings'
import { buildMetadata } from '@/core/seo'
import {
  PixelApplicabilitySection,
  PixelDataBoundarySection,
  PixelHeroSection,
  PixelLimitsSection,
  PixelRequirementsSection,
} from '@/ui/pages/pixel/details-section'

export async function generateMetadata() {
  const repository = getContentRepository()
  const [product, settings] = await Promise.all([
    repository.getProduct('pixel'),
    getRequiredSiteSettings(repository),
  ])
  if (!product) throw new Error('Product content is missing: pixel')
  return buildMetadata(product.seo, settings)
}

export default async function PixelProductPage() {
  const repository = getContentRepository()
  const product = await repository.getProduct('pixel')
  if (!product) throw new Error('Product content is missing: pixel')
  const content = getProductPageContent('pixel')

  return (
    <main>
      <PixelHeroSection product={product} />
      <PixelRequirementsSection requirements={content.requirements} />
      <PixelDataBoundarySection boundaries={content.boundaries} />
      <PixelLimitsSection allowedClaims={getPublicClaimsForProduct('pixel')} />
      <PixelApplicabilitySection />
    </main>
  )
}
