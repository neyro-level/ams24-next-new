import type { ArticleDTO, KnowledgeArticleDTO } from '@/core/content/schemas'
import { buildMetadata } from '@/core/seo'

import { getRequiredSiteSettings } from './site-settings'

export async function buildArticleEditorialMetadata(article: ArticleDTO) {
  const settings = await getRequiredSiteSettings()

  return buildMetadata(article.seo, settings, { type: 'article' })
}

export async function buildKnowledgeEditorialMetadata(article: KnowledgeArticleDTO) {
  const settings = await getRequiredSiteSettings()

  return buildMetadata(article.seo, settings, { type: 'article' })
}
