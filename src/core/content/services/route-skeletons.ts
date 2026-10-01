import { buildNoindexMetadata } from '@/core/seo'
import {
  dynamicRouteTypes as projectDynamicRouteTypes,
  staticRouteSkeletons as projectStaticRouteSkeletons,
  type RouteSkeleton as ProjectRouteSkeleton,
} from '@/project/content/route-skeletons'

import { getRequiredSiteSettings } from './site-settings'

export type RouteSkeleton = ProjectRouteSkeleton
export const staticRouteSkeletons: readonly RouteSkeleton[] = projectStaticRouteSkeletons
export const dynamicRouteTypes = projectDynamicRouteTypes

export function getStaticRouteSkeletons(): readonly RouteSkeleton[] {
  return staticRouteSkeletons
}

export function getDynamicRouteTypes() {
  return dynamicRouteTypes
}

export function getStaticRouteSkeleton(path: string): RouteSkeleton {
  const route = staticRouteSkeletons.find((item) => item.path === path)

  if (!route) {
    throw new Error(`Unknown static route skeleton: ${path}`)
  }

  return route
}

export async function buildSkeletonMetadata(route: RouteSkeleton) {
  const settings = await getRequiredSiteSettings()

  return buildNoindexMetadata({
    title: `${route.title} — скоро`,
    description: `${route.role}: ${route.intent}. Страница готовится к наполнению.`,
    canonicalPath: route.path,
  }, settings)
}
