import {
  buildArticleEditorialMetadata,
  toPublicArticleDTO,
} from '@/core/content/services/editorial-contracts'
import { getContentRepository } from '@/core/content/services/repository'
import { ArticleEditorialTemplate } from '@/ui/content/article-editorial-template'
import { notFound } from 'next/navigation'

export const dynamicParams = false

export async function generateStaticParams() {
  const articles = await getContentRepository().getArticles()
  return articles
    .filter((article) => article.status === 'published')
    .map((article) => ({ slug: article.slug }))
}

async function getArticle(slug: string) {
  const article = await getContentRepository().getArticleByPath(`/stati/${slug}/`)
  if (!article || article.status !== 'published') notFound()
  return article
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return buildArticleEditorialMetadata(await getArticle(slug))
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <ArticleEditorialTemplate article={toPublicArticleDTO(await getArticle(slug))} />
}
