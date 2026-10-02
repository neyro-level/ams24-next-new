import { buildNoindexMetadata } from '@/core/seo'
import {
  legalDraftVersion as projectLegalDraftVersion,
  legalPages,
} from '@/project/content/legal-pages'

import { getRequiredSiteSettings } from './site-settings'

export type LegalPageKind = keyof typeof legalPages
export type LegalPageDTO = Readonly<
  (typeof legalPages)[LegalPageKind] & {
    version: string
  }
>

export function getLegalPage(kind: LegalPageKind): LegalPageDTO {
  return {
    ...legalPages[kind],
    version: projectLegalDraftVersion,
  }
}

export async function buildLegalMetadata(page: LegalPageDTO) {
  const settings = await getRequiredSiteSettings()

  return buildNoindexMetadata({
    title: `${page.title} — согласование документа`,
    description: `${page.title}: страница зарезервирована под утверждённую юридическую редакцию и не индексируется до финального согласования.`,
    canonicalPath: page.path,
  }, settings)
}
