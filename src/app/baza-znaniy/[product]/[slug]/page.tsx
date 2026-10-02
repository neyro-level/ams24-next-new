import {
  buildKnowledgeEditorialMetadata,
  toPublicKnowledgeArticleDTO,
} from '@/core/content/services/editorial-contracts'
import { getContentRepository } from '@/core/content/services/repository'
import { KnowledgeEditorialTemplate } from '@/ui/content/knowledge-editorial-template'
import { notFound } from 'next/navigation'

export const dynamicParams = false

export async function generateStaticParams() {
  const knowledgeArticles = await getContentRepository().getKnowledgeArticles()
  return knowledgeArticles
    .filter((article) => article.status === 'published')
    .map((article) => ({ product: article.productRef, slug: article.slug }))
}

async function getKnowledgeArticle(product: string, slug: string) {
  const article = await getContentRepository().getKnowledgeArticleByPath(
    `/baza-znaniy/${product}/${slug}/`,
  )
  if (!article || article.status !== 'published') notFound()
  return article
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ product: string; slug: string }>
}) {
  const { product, slug } = await params
  return buildKnowledgeEditorialMetadata(await getKnowledgeArticle(product, slug))
}

export default async function KnowledgeDetailPage({
  params,
}: {
  params: Promise<{ product: string; slug: string }>
}) {
  const { product, slug } = await params
  return <KnowledgeEditorialTemplate article={toPublicKnowledgeArticleDTO(await getKnowledgeArticle(product, slug))} />
}
