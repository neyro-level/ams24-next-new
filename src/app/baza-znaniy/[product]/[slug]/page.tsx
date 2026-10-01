import {
  buildKnowledgeEditorialMetadata,
  getRepresentativeKnowledgeContract,
} from '@/core/content/services/editorial-contracts'
import { KnowledgeEditorialTemplate } from '@/ui/content/knowledge-editorial-template'

export const dynamicParams = false
const representativeKnowledgeContract = getRepresentativeKnowledgeContract()

export function generateStaticParams() {
  return [{
    product: representativeKnowledgeContract.product,
    slug: representativeKnowledgeContract.slug,
  }]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ product: string; slug: string }>
}) {
  const { product, slug } = await params
  if (product !== representativeKnowledgeContract.product || slug !== representativeKnowledgeContract.slug) {
    throw new Error(`Unknown knowledge contract: ${product}/${slug}`)
  }

  return buildKnowledgeEditorialMetadata(representativeKnowledgeContract)
}

export default async function KnowledgeDetailPage({
  params,
}: {
  params: Promise<{ product: string; slug: string }>
}) {
  const { product, slug } = await params
  if (product !== representativeKnowledgeContract.product || slug !== representativeKnowledgeContract.slug) {
    throw new Error(`Unknown knowledge contract: ${product}/${slug}`)
  }

  return <KnowledgeEditorialTemplate contract={representativeKnowledgeContract} />
}
