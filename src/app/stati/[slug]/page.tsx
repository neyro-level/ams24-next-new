import {
  buildArticleEditorialMetadata,
  getRepresentativeArticleContract,
} from '@/core/content/services/editorial-contracts'
import { ArticleEditorialTemplate } from '@/ui/content/article-editorial-template'

export const dynamicParams = false
const representativeArticleContract = getRepresentativeArticleContract()

export function generateStaticParams() {
  return [{ slug: representativeArticleContract.slug }]
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (slug !== representativeArticleContract.slug) {
    throw new Error(`Unknown article contract: ${slug}`)
  }

  return buildArticleEditorialMetadata(representativeArticleContract)
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (slug !== representativeArticleContract.slug) {
    throw new Error(`Unknown article contract: ${slug}`)
  }

  return <ArticleEditorialTemplate contract={representativeArticleContract} />
}
