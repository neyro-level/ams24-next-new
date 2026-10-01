import { getProductPageContent } from '@/core/content/services/product-pages'
import { getPublicClaimsForProduct } from '@/core/content/services/product-claims'
import { getContentRepository } from '@/core/content/services/repository'
import { getRequiredSiteSettings } from '@/core/content/services/site-settings'
import { buildMetadata } from '@/core/seo'
import {
  ImpulsCriteriaSection,
  ImpulsFaqSection,
  ImpulsHeroSection,
  ImpulsLeadSection,
  ImpulsLimitsSection,
  ImpulsMechanicsSection,
} from '@/ui/pages/impuls/details-section'

export async function generateMetadata() {
  const repository = getContentRepository()
  const [product, settings] = await Promise.all([
    repository.getProduct('impuls'),
    getRequiredSiteSettings(repository),
  ])
  if (!product) throw new Error('Product content is missing: impuls')
  return buildMetadata(product.seo, settings)
}

export default async function ImpulsProductPage() {
  const repository = getContentRepository()
  const product = await repository.getProduct('impuls')
  if (!product) throw new Error('Product content is missing: impuls')
  const content = getProductPageContent('impuls')

  return (
    <main>
      <ImpulsHeroSection product={product} />
      <ImpulsCriteriaSection criteria={content.criteria} />
      <ImpulsMechanicsSection steps={content.steps} />
      <ImpulsLimitsSection
        allowedClaims={getPublicClaimsForProduct('impuls')}
      />
      <ImpulsFaqSection faqs={content.faqs} />
      <ImpulsLeadSection />
    </main>
  )
}
