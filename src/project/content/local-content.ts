import type { LocalContentInput } from '@/core/content/repository/local-adapter'

const productSeo = {
  title: 'Импульс — маркетинговые продукты AMS24',
  description: 'Платформа Импульс помогает выбрать продукт для привлечения, определения и защиты лидов.',
  canonicalPath: '/',
}

export const localContent = {
  products: [
    {
      id: 'impuls',
      name: 'Импульс',
      shortName: 'Импульс',
      path: '/impuls/',
      promise: 'Привлечение лидов через проверенные аудитории и понятный запуск кампании.',
      primaryCta: {
        id: 'calculate-launch',
        label: 'Рассчитать запуск',
      },
      seo: {
        ...productSeo,
        title: 'Импульс — лидогенерация для бизнеса',
        canonicalPath: '/impuls/',
      },
    },
    {
      id: 'pixel',
      name: 'Импульс Пиксель',
      shortName: 'Пиксель',
      path: '/pixel/',
      promise: 'Определение части заинтересованных посетителей собственного сайта для передачи в продажи.',
      primaryCta: {
        id: 'check-pixel',
        label: 'Проверить применимость',
      },
      seo: {
        ...productSeo,
        title: 'Импульс Пиксель — определение посетителей сайта',
        canonicalPath: '/pixel/',
      },
    },
    {
      id: 'zashchita',
      name: 'Импульс Защита',
      shortName: 'Защита',
      path: '/zashchita/',
      promise: 'Аудит и меры снижения риска перехвата лидов без абсолютных неподтверждённых гарантий.',
      primaryCta: {
        id: 'request-audit',
        label: 'Провести аудит',
      },
      seo: {
        ...productSeo,
        title: 'Импульс Защита — аудит риска перехвата лидов',
        canonicalPath: '/zashchita/',
      },
    },
  ],
  pages: [
    {
      id: 'home',
      path: '/',
      role: 'платформа и маршрутизация',
      intent: 'понять линейку продуктов и выбрать подходящий маршрут',
      h1: 'Импульс',
      seo: productSeo,
      blocks: [
        {
          type: 'hero',
          title: 'Импульс',
          lead: 'Единая платформа для привлечения, определения и защиты лидов.',
        },
        {
          type: 'product-routes',
          productRefs: ['impuls', 'pixel', 'zashchita'],
        },
        {
          type: 'lead-form-shell',
          intentId: 'home-final-calc',
        },
      ],
    },
  ],
} satisfies LocalContentInput
