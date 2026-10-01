import type { ArticleDTO } from '@/core/content/schemas'
import { buildMetadata, buildNoindexMetadata } from '@/core/seo'
import {
  representativeKnowledgeContract,
  type KnowledgeEditorialContract as ProjectKnowledgeEditorialContract,
} from '@/project/editorial-contracts'

import { getRequiredSiteSettings } from './site-settings'

export type KnowledgeEditorialContract = ProjectKnowledgeEditorialContract

export function getRepresentativeKnowledgeContract(): KnowledgeEditorialContract {
  return representativeKnowledgeContract
}

export async function buildArticleEditorialMetadata(article: ArticleDTO) {
  const settings = await getRequiredSiteSettings()

  return buildMetadata(article.seo, settings, { type: 'article' })
}

export async function buildKnowledgeEditorialMetadata(contract: KnowledgeEditorialContract) {
  const settings = await getRequiredSiteSettings()

  return buildNoindexMetadata({
    title: `${contract.h1} — база знаний`,
    description: contract.expectedOutcome,
    canonicalPath: `/baza-znaniy/${contract.product}/${contract.slug}/`,
  }, settings, { type: 'article' })
}
