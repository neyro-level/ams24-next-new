import type { PageDTO, SiteSettingsDTO } from '@/core/content/schemas'
import { requireSiteSettings } from '@/core/content/validation/site-settings'

import type { ContentRepository } from '../repository'
import { getContentRepository } from './repository'

export async function getRequiredSiteSettings(repository?: ContentRepository): Promise<SiteSettingsDTO> {
  try {
    const resolvedRepository = repository ?? getContentRepository()
    return requireSiteSettings(await resolvedRepository.getSiteSettings())
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('Canonical Site Settings')) {
      throw error
    }

    throw new Error('Canonical Site Settings are missing or invalid', { cause: error })
  }
}

export async function getRequiredPageByPath(
  path: string,
  repository: ContentRepository = getContentRepository(),
): Promise<PageDTO> {
  const page = await repository.getPageByPath(path)

  if (!page) {
    throw new Error(`Canonical page content is missing: ${path}`)
  }

  return page
}
