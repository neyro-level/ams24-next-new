import type { SiteSettingsInput } from '@/core/content/schemas'

export const siteOrigin = 'https://ams24.ru'

export const siteSettings = {
  siteName: 'Импульс',
  domain: siteOrigin,
  defaultOgImage: '/images/impuls-og-default.png',
  organization: {
    name: 'Импульс',
    legalName: 'ИП Скрицкая Юлия Викторовна',
    taxID: '231295699557',
    telephone: '+7 918 320 9996',
    email: 'integrator-p@yandex.ru',
    logo: '/images/impuls-logo.png',
  },
  defaultSeo: {
    title: 'Импульс — маркетинговые продукты AMS24',
    description: 'Платформа Импульс помогает выбрать продукт для привлечения, определения и защиты лидов.',
    canonicalPath: '/',
  },
} satisfies SiteSettingsInput

