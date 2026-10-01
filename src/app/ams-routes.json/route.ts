import { buildRouteArtifactManifest } from '@/core/seo'

export const dynamic = 'force-static'

export async function GET() {
  return Response.json(await buildRouteArtifactManifest())
}
