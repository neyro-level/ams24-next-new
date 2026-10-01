import { buildNoindexMetadata } from '@/core/seo'
import {
  legalDraftVersion as projectLegalDraftVersion,
  legalPages,
} from '@/project/content/legal-pages'

export type LegalPageKind = keyof typeof legalPages
export type LegalPageDTO = (typeof legalPages)[LegalPageKind]

export const legalDraftVersion = projectLegalDraftVersion

export function getLegalPage(kind: LegalPageKind): LegalPageDTO {
  return legalPages[kind]
}

export function buildLegalMetadata(kind: LegalPageKind) {
  const page = getLegalPage(kind)

  return buildNoindexMetadata({
    title: `${page.title} — черновая страница`,
    description: `${page.title}: страница зарезервирована под утверждённую юридическую редакцию и не индексируется до финального согласования.`,
    canonicalPath: page.path,
  })
}
