import type { SiteSettingsInput } from '@/core/content/schemas'

export const siteOrigin = 'https://ams24.ru'

export const siteSettings = {
  siteName: 'Импульс',
  domain: siteOrigin,
  defaultSeo: {
    title: 'Импульс — маркетинговые продукты AMS24',
    description: 'Платформа Импульс помогает выбрать продукт для привлечения, определения и защиты лидов.',
    canonicalPath: '/',
  },
} satisfies SiteSettingsInput

