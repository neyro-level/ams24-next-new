import { buildNoindexMetadata } from '@/core/seo'

export type RouteSkeleton = {
  path: string
  title: string
  role: string
  intent: string
  nextStep: string
}

export const staticRouteSkeletons: RouteSkeleton[] = [
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

export function buildSkeletonMetadata(route: RouteSkeleton) {
  return buildNoindexMetadata({
    title: `${route.title} — скоро`,
    description: `${route.role}: ${route.intent}. Страница готовится к наполнению.`,
    canonicalPath: route.path,
  })
}
