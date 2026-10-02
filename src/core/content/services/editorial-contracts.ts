import {
  publicArticleSchema,
  publicKnowledgeArticleSchema,
  type ArticleDTO,
  type KnowledgeArticleDTO,
  type PublicArticleDTO,
  type PublicKnowledgeArticleDTO,
} from '@/core/content/schemas'
import { buildMetadata } from '@/core/seo'

import { getRequiredSiteSettings } from './site-settings'

export function toPublicArticleDTO(article: ArticleDTO): PublicArticleDTO {
  return publicArticleSchema.parse({
    path: article.path,
    title: article.title,
    description: article.seo.description,
    body: article.body,
  })
}

export function toPublicKnowledgeArticleDTO(article: KnowledgeArticleDTO): PublicKnowledgeArticleDTO {
  return publicKnowledgeArticleSchema.parse({
    path: article.path,
    productRef: article.productRef,
    title: article.seo.title,
    description: article.seo.description,
    body: article.body,
  })
}

export async function buildArticleEditorialMetadata(article: ArticleDTO) {
  const settings = await getRequiredSiteSettings()

  return buildMetadata(article.seo, settings, { type: 'article' })
}

export async function buildKnowledgeEditorialMetadata(article: KnowledgeArticleDTO) {
  const settings = await getRequiredSiteSettings()

  return buildMetadata(article.seo, settings, { type: 'article' })
}
