import {
  siteSettingsSchema,
  type SiteSettingsDTO,
} from '@/core/content/schemas'

export function requireSiteSettings(input: unknown): SiteSettingsDTO {
  const result = siteSettingsSchema.safeParse(input)

  if (!result.success) {
    throw new Error(`Canonical Site Settings are missing or invalid: ${result.error.message}`)
  }

  return result.data
}
