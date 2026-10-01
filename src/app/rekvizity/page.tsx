import { buildSkeletonMetadata, getStaticRouteSkeleton } from '@/core/content/services/route-skeletons'
import { RouteSkeletonPage } from '@/ui/shell/route-skeleton-page'

const route = getStaticRouteSkeleton('/rekvizity/')

export async function generateMetadata() {
  return buildSkeletonMetadata(route)
}

export default function Page() {
  return <RouteSkeletonPage route={route} />
}
