import {
  buildArticleEditorialMetadata,
  representativeArticleContract,
} from '@/core/content/services/editorial-contracts'
import { getContentRepository } from '@/core/content/services/repository'
import { ArticleEditorialTemplate } from '@/ui/content/article-editorial-template'

export const dynamicParams = false

export async function generateStaticParams() {
  return (await getContentRepository().getArticles())
    .filter((article) => article.status === 'published')
    .map((article) => ({ slug: article.slug }))
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
