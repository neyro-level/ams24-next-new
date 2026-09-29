import { buildSkeletonMetadata, getStaticRouteSkeleton } from '@/project/route-skeletons'
import { RouteSkeletonPage } from '@/ui/shell/route-skeleton-page'

const route = getStaticRouteSkeleton('/soglasie/')

export const metadata = buildSkeletonMetadata(route)

export default function Page() {
  return <RouteSkeletonPage route={route} />
}
