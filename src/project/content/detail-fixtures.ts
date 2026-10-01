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
]
