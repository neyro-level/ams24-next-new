import {
  buildKnowledgeEditorialMetadata,
  representativeKnowledgeContract,
} from '@/core/content/services/editorial-contracts'
import { getContentRepository } from '@/core/content/services/repository'
import { KnowledgeEditorialTemplate } from '@/ui/content/knowledge-editorial-template'

export const dynamicParams = false

export async function generateStaticParams() {
  return (await getContentRepository().getKnowledgeArticles())
    .filter((article) => article.status === 'published')
    .map((article) => ({ product: article.productRef, slug: article.slug }))
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
