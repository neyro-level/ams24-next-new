import { getProductPageContent } from '@/core/content/services/product-pages'
import { getPublicClaimsForProduct } from '@/core/content/services/product-claims'
import { getContentRepository } from '@/core/content/services/repository'
import { getRequiredSiteSettings } from '@/core/content/services/site-settings'
import { buildMetadata } from '@/core/seo'
import {
  ZashchitaAuditSection,
  ZashchitaFaqSection,
  ZashchitaHeroSection,
  ZashchitaLeadSection,
  ZashchitaLimitsSection,
  ZashchitaSymptomsSection,
} from '@/ui/pages/zashchita/details-section'

export async function generateMetadata() {
  const repository = getContentRepository()
  const [product, settings] = await Promise.all([
    repository.getProduct('zashchita'),
    getRequiredSiteSettings(repository),
  ])
  if (!product) throw new Error('Product content is missing: zashchita')
  return buildMetadata(product.seo, settings)
}

export default async function ZashchitaProductPage() {
  const repository = getContentRepository()
  const product = await repository.getProduct('zashchita')
  if (!product) throw new Error('Product content is missing: zashchita')
  const content = getProductPageContent('zashchita')

  return (
    <main>
      <ZashchitaHeroSection product={product} />
      <ZashchitaSymptomsSection symptoms={content.symptoms} />
      <ZashchitaAuditSection steps={content.steps} />
      <ZashchitaLimitsSection
        allowedClaims={getPublicClaimsForProduct('zashchita')}
      />
      <ZashchitaFaqSection faqs={content.faqs} />
      <ZashchitaLeadSection />
    </main>
  )
}
