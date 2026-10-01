import { buildNoindexMetadata } from '@/core/seo'
import {
  representativeArticleContract,
  representativeKnowledgeContract,
  type ArticleEditorialContract as ProjectArticleEditorialContract,
  type KnowledgeEditorialContract as ProjectKnowledgeEditorialContract,
} from '@/project/editorial-contracts'

import { getRequiredSiteSettings } from './site-settings'

export type ArticleEditorialContract = ProjectArticleEditorialContract
export type KnowledgeEditorialContract = ProjectKnowledgeEditorialContract

export function getRepresentativeArticleContract(): ArticleEditorialContract {
  return representativeArticleContract
}

export function getRepresentativeKnowledgeContract(): KnowledgeEditorialContract {
  return representativeKnowledgeContract
}

export async function buildArticleEditorialMetadata(contract: ArticleEditorialContract) {
  const settings = await getRequiredSiteSettings()

  return buildNoindexMetadata({
    title: `${contract.h1} — статья`,
    description: contract.jtbd,
    canonicalPath: `/stati/${contract.slug}/`,
  }, settings, { type: 'article' })
}

export async function buildKnowledgeEditorialMetadata(contract: KnowledgeEditorialContract) {
  const settings = await getRequiredSiteSettings()

  return buildNoindexMetadata({
    title: `${contract.h1} — база знаний`,
    description: contract.expectedOutcome,
    canonicalPath: `/baza-znaniy/${contract.product}/${contract.slug}/`,
  }, settings, { type: 'article' })
}
