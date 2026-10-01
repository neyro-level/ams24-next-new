import type { ProductId } from '@/core/content/schemas'
import type { NavigationLink } from '@/project/navigation'

export type DetailFixture = {
  type: 'case' | 'article' | 'knowledge'
  path: string
  slug: string
  product?: ProductId
  title: string
  eyebrow: string
  summary: string
  breadcrumbs: NavigationLink[]
  related: NavigationLink[]
}

export const detailFixtures: DetailFixture[] = [
  {
    type: 'case',
    path: '/keisy/medical-case/',
    slug: 'medical-case',
    product: 'impuls',
    title: 'Кейс в медицинской нише',
    eyebrow: 'Representative case detail',
    summary: 'Скелет детального кейса показывает будущую структуру: задача, метод, метрики, ограничения и CTA.',
    breadcrumbs: [{ label: 'Кейсы', path: '/keisy/' }, { label: 'Медицинская ниша', path: '/keisy/medical-case/' }],
    related: [
      { label: 'Импульс', path: '/impuls/' },
      { label: 'Расчёты', path: '/raschety/' },
    ],
  },
  {
    type: 'article',
    path: '/stati/kak-vybrat-produkt/',
    slug: 'kak-vybrat-produkt',
    title: 'Как выбрать продукт Импульс',
    eyebrow: 'Representative article detail',
    summary: 'Скелет статьи фиксирует будущий editorial layout, связанные продукты и переход к расчёту.',
    breadcrumbs: [{ label: 'Статьи', path: '/stati/' }, { label: 'Как выбрать продукт', path: '/stati/kak-vybrat-produkt/' }],
    related: [
      { label: 'Импульс Пиксель', path: '/pixel/' },
      { label: 'Импульс Защита', path: '/zashchita/' },
    ],
  },
  {
    type: 'knowledge',
    path: '/baza-znaniy/impuls/kak-podgotovit-raschet/',
    slug: 'kak-podgotovit-raschet',
    product: 'impuls',
    title: 'Как подготовить данные для расчёта',
    eyebrow: 'Representative KB detail',
    summary: 'Скелет инструкции показывает будущую структуру базы знаний: задача, входные данные, шаги и следующий маршрут.',
    breadcrumbs: [
      { label: 'База знаний', path: '/baza-znaniy/' },
      { label: 'Импульс', path: '/impuls/' },
      { label: 'Подготовить расчёт', path: '/baza-znaniy/impuls/kak-podgotovit-raschet/' },
    ],
    related: [
      { label: 'Тарифы', path: '/tarify/' },
      { label: 'Контакты', path: '/kontakty/' },
    ],
  },
]
