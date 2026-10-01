import type { ProductId } from '@/core/content/schemas'
import { buildNoindexMetadata } from '@/core/seo'
import {
  detailFixtures as projectDetailFixtures,
  type DetailFixture as ProjectDetailFixture,
} from '@/project/content/detail-fixtures'

export type DetailFixture = ProjectDetailFixture
export const detailFixtures: readonly DetailFixture[] = projectDetailFixtures

export function getDetailFixtures(): readonly DetailFixture[] {
  return detailFixtures
}

export function getDetailFixture(
  type: DetailFixture['type'],
  slug: string,
  product?: ProductId,
): DetailFixture {
  const item = detailFixtures.find((fixture) => {
    if (fixture.type !== type || fixture.slug !== slug) {
      return false
    }

    return product ? fixture.product === product : true
  })

  if (!item) {
    throw new Error(`Unknown detail fixture: ${type}/${product ? `${product}/` : ''}${slug}`)
  }

  return item
}

export function buildDetailFixtureMetadata(fixture: DetailFixture) {
  return buildNoindexMetadata({
    title: `${fixture.title} — skeleton`,
    description: fixture.summary,
    canonicalPath: fixture.path,
  })
}
