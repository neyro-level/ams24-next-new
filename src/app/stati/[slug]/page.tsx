import {
  buildDetailFixtureMetadata,
  detailFixtures,
  getDetailFixture,
} from '@/project/detail-fixtures'
import { DetailFixturePage } from '@/ui/shell/detail-fixture-page'

export const dynamicParams = false

export function generateStaticParams() {
  return detailFixtures
    .filter((fixture) => fixture.type === 'article')
    .map((fixture) => ({ slug: fixture.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return buildDetailFixtureMetadata(getDetailFixture('article', slug))
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <DetailFixturePage fixture={getDetailFixture('article', slug)} />
}
