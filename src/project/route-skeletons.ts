import type { Metadata } from 'next'

export type RouteSkeleton = {
  path: string
  title: string
  role: string
  intent: string
  nextStep: string
}

export const staticRouteSkeletons: RouteSkeleton[] = [
  {
    path: '/impuls/',
    title: 'Импульс',
    role: 'продающая страница главного продукта',
    intent: 'оценить привлечение лидов через целевые аудитории',
    nextStep: 'EPIC-05 наполнит страницу доказанными секциями продукта.',
  },
  {
    path: '/pixel/',
    title: 'Импульс Пиксель',
    role: 'продуктовая страница пикселя',
    intent: 'понять применимость определения посетителей собственного сайта',
    nextStep: 'EPIC-05 добавит сценарии, требования к трафику и privacy boundaries.',
  },
  {
    path: '/zashchita/',
    title: 'Импульс Защита',
    role: 'продуктовая страница защиты',
    intent: 'оценить аудит и меры снижения риска перехвата лидов',
    nextStep: 'EPIC-05 добавит threat model, процесс аудита и ограничения гарантий.',
  },
  {
    path: '/tarify/',
    title: 'Тарифы',
    role: 'сравнение условий',
    intent: 'понять модель цены и состав услуги',
    nextStep: 'EPIC-06 наполнит тарифные карточки и ограничения публикации.',
  },
  {
    path: '/keisy/',
    title: 'Кейсы',
    role: 'доказательства',
    intent: 'найти опыт в своей нише',
    nextStep: 'EPIC-06 добавит publishable case inventory.',
  },
  {
    path: '/otzyvy/',
    title: 'Отзывы',
    role: 'social proof',
    intent: 'проверить доверие к исполнителю',
    nextStep: 'EPIC-06 добавит отзывы с permission status.',
  },
  {
    path: '/raschety/',
    title: 'Расчёты',
    role: 'экономика',
    intent: 'понять принцип расчёта и диапазоны',
    nextStep: 'EPIC-06 добавит проверяемые расчётные примеры.',
  },
  {
    path: '/stati/',
    title: 'Статьи',
    role: 'editorial hub',
    intent: 'изучить рынок и подходы',
    nextStep: 'EPIC-07 добавит статьи и SEO briefs.',
  },
  {
    path: '/baza-znaniy/',
    title: 'База знаний',
    role: 'support hub',
    intent: 'найти инструкцию по продукту',
    nextStep: 'EPIC-07 добавит KB-инструкции по продуктовым веткам.',
  },
  {
    path: '/o-kompanii/',
    title: 'О компании',
    role: 'доверие',
    intent: 'понять опыт и принципы',
    nextStep: 'EPIC-06/07 добавят подтверждённые доказательства и материалы.',
  },
  {
    path: '/kontakty/',
    title: 'Контакты',
    role: 'контакт',
    intent: 'выбрать канал связи',
    nextStep: 'EPIC-08 подключит безопасный lead/contact flow.',
  },
  {
    path: '/politika/',
    title: 'Политика',
    role: 'юридическая функция',
    intent: 'ознакомиться с политикой обработки данных',
    nextStep: 'EPIC-08 добавит утверждённую legal version.',
  },
  {
    path: '/soglasie/',
    title: 'Согласие',
    role: 'юридическая функция',
    intent: 'ознакомиться с согласием на обработку данных',
    nextStep: 'EPIC-08 добавит утверждённую consent version.',
  },
  {
    path: '/obrabotka-dannyh/',
    title: 'Обработка данных',
    role: 'юридическая функция',
    intent: 'понять состав и правила обработки данных',
    nextStep: 'EPIC-08 добавит утверждённый договор/условия обработки.',
  },
  {
    path: '/rekvizity/',
    title: 'Реквизиты',
    role: 'юридическая функция',
    intent: 'проверить реквизиты исполнителя',
    nextStep: 'EPIC-08 добавит проверенную юридическую информацию.',
  },
]

export const dynamicRouteTypes = [
  '/keisy/[slug]/',
  '/stati/[slug]/',
  '/baza-znaniy/[product]/[slug]/',
] as const

export function getStaticRouteSkeleton(path: string): RouteSkeleton {
  const route = staticRouteSkeletons.find((item) => item.path === path)

  if (!route) {
    throw new Error(`Unknown static route skeleton: ${path}`)
  }

  return route
}

export function buildSkeletonMetadata(route: RouteSkeleton): Metadata {
  return {
    title: `${route.title} — скоро`,
    description: `${route.role}: ${route.intent}. Страница готовится к наполнению.`,
    alternates: {
      canonical: route.path,
    },
    robots: {
      index: false,
      follow: true,
    },
  }
}
