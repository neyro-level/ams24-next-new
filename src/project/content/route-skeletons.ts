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
    nextStep: 'Страница будет наполнена статьями после подготовки материалов.',
  },
  {
    path: '/baza-znaniy/',
    title: 'База знаний',
    role: 'support hub',
    intent: 'найти инструкцию по продукту',
    nextStep: 'Страница будет наполнена инструкциями по продуктовым веткам.',
  },
  {
    path: '/o-kompanii/',
    title: 'О компании',
    role: 'доверие',
    intent: 'понять опыт и принципы',
    nextStep: 'Страница будет наполнена подтверждёнными доказательствами и материалами.',
  },
  {
    path: '/kontakty/',
    title: 'Контакты',
    role: 'контакт',
    intent: 'выбрать канал связи',
    nextStep: 'Страница будет подключена к безопасному сценарию обращения.',
  },
  {
    path: '/politika/',
    title: 'Политика',
    role: 'юридическая функция',
    intent: 'ознакомиться с политикой обработки данных',
    nextStep: 'Страница получит утверждённую юридическую редакцию.',
  },
  {
    path: '/soglasie/',
    title: 'Согласие',
    role: 'юридическая функция',
    intent: 'ознакомиться с согласием на обработку данных',
    nextStep: 'Страница получит утверждённую редакцию согласия.',
  },
  {
    path: '/obrabotka-dannyh/',
    title: 'Обработка данных',
    role: 'юридическая функция',
    intent: 'понять состав и правила обработки данных',
    nextStep: 'Страница получит утверждённые условия обработки данных.',
  },
  {
    path: '/rekvizity/',
    title: 'Реквизиты',
    role: 'юридическая функция',
    intent: 'проверить реквизиты исполнителя',
    nextStep: 'Страница получит проверенную юридическую информацию.',
  },
]

export const dynamicRouteTypes = [
  '/keisy/[slug]/',
  '/stati/[slug]/',
  '/baza-znaniy/[product]/[slug]/',
] as const
