import {
  buildDetailFixtureMetadata,
  detailFixtures,
  getDetailFixture,
} from '@/core/content/services/detail-fixtures'
import { DetailFixturePage } from '@/ui/shell/detail-fixture-page'

export const dynamicParams = false

export function generateStaticParams() {
  return detailFixtures
    .filter((fixture) => fixture.type === 'case')
    .map((fixture) => ({ slug: fixture.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return buildDetailFixtureMetadata(getDetailFixture('case', slug))
}

export default async function CaseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <DetailFixturePage fixture={getDetailFixture('case', slug)} />
}
