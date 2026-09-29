import {
  buildDetailFixtureMetadata,
  detailFixtures,
  getDetailFixture,
} from '@/project/detail-fixtures'
import { DetailFixturePage } from '@/ui/shell/detail-fixture-page'

export const dynamicParams = false

export function generateStaticParams() {
  return detailFixtures
    .filter((fixture) => fixture.type === 'knowledge' && fixture.product)
    .map((fixture) => ({ product: fixture.product, slug: fixture.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ product: string; slug: string }>
}) {
  const { product, slug } = await params
  return buildDetailFixtureMetadata(getDetailFixture('knowledge', slug, product))
}

export default async function KnowledgeDetailPage({
  params,
}: {
  params: Promise<{ product: string; slug: string }>
}) {
  const { product, slug } = await params
  return <DetailFixturePage fixture={getDetailFixture('knowledge', slug, product)} />
}
