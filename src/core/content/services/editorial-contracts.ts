import { buildNoindexMetadata } from '@/core/seo'
import {
  representativeArticleContract,
  representativeKnowledgeContract,
  type ArticleEditorialContract as ProjectArticleEditorialContract,
  type KnowledgeEditorialContract as ProjectKnowledgeEditorialContract,
} from '@/project/editorial-contracts'

export type ArticleEditorialContract = ProjectArticleEditorialContract
export type KnowledgeEditorialContract = ProjectKnowledgeEditorialContract

export function getRepresentativeArticleContract(): ArticleEditorialContract {
  return representativeArticleContract
}

export function getRepresentativeKnowledgeContract(): KnowledgeEditorialContract {
  return representativeKnowledgeContract
}

export function buildArticleEditorialMetadata(contract: ArticleEditorialContract) {
  return buildNoindexMetadata({
    title: `${contract.h1} — статья`,
    description: contract.jtbd,
    canonicalPath: `/stati/${contract.slug}/`,
  }, { type: 'article' })
}

export function buildKnowledgeEditorialMetadata(contract: KnowledgeEditorialContract) {
  return buildNoindexMetadata({
    title: `${contract.h1} — база знаний`,
    description: contract.expectedOutcome,
    canonicalPath: `/baza-znaniy/${contract.product}/${contract.slug}/`,
  }, { type: 'article' })
}
