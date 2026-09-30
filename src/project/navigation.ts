import type { NavigationInput } from '@/core/content/schemas'

export type NavigationLink = {
  label: string
  path: string
}

export type FooterGroup = {
  title: string
  links: NavigationLink[]
}

export const productLinks: NavigationLink[] = [
  { label: 'Импульс', path: '/impuls/' },
  { label: 'Импульс Пиксель', path: '/pixel/' },
  { label: 'Импульс Защита', path: '/zashchita/' },
]

export const headerLinks: NavigationLink[] = [
  { label: 'Тарифы', path: '/tarify/' },
  { label: 'Кейсы', path: '/keisy/' },
  { label: 'Отзывы', path: '/otzyvy/' },
  { label: 'Статьи', path: '/stati/' },
  { label: 'База знаний', path: '/baza-znaniy/' },
]

export const primaryCta: NavigationLink = {
  label: 'Получить расчёт',
  path: '/#lead-form',
}

export const footerGroups: FooterGroup[] = [
  {
    title: 'Продукты',
    links: productLinks,
  },
  {
    title: 'Выбор и доказательства',
    links: [
      { label: 'Тарифы', path: '/tarify/' },
      { label: 'Расчёты', path: '/raschety/' },
      { label: 'Кейсы', path: '/keisy/' },
      { label: 'Отзывы', path: '/otzyvy/' },
    ],
  },
  {
    title: 'Материалы',
    links: [
      { label: 'Статьи', path: '/stati/' },
      { label: 'База знаний', path: '/baza-znaniy/' },
    ],
  },
  {
    title: 'Компания',
    links: [
      { label: 'О компании', path: '/o-kompanii/' },
      { label: 'Контакты', path: '/kontakty/' },
      { label: 'Реквизиты', path: '/rekvizity/' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Политика', path: '/politika/' },
      { label: 'Согласие', path: '/soglasie/' },
      { label: 'Обработка данных', path: '/obrabotka-dannyh/' },
    ],
  },
]

export const firstLevelRoutes: NavigationLink[] = [
  { label: 'Главная', path: '/' },
  ...productLinks,
  ...headerLinks,
  { label: 'Расчёты', path: '/raschety/' },
  { label: 'О компании', path: '/o-kompanii/' },
  { label: 'Контакты', path: '/kontakty/' },
]

export const navigationContent = {
  header: headerLinks,
  footer: Object.fromEntries(footerGroups.map((group) => [group.title, group.links])),
  primaryCta: {
    id: 'lead-form',
    ...primaryCta,
  },
} satisfies NavigationInput
