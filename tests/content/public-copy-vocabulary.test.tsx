import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import HomePage from '@/app/page'
import ImpulsProductPage from '@/app/impuls/page'
import PixelProductPage from '@/app/pixel/page'
import ZashchitaProductPage from '@/app/zashchita/page'
import TariffsPage from '@/app/tarify/page'
import CalculationsPage from '@/app/raschety/page'
import CasesPage from '@/app/keisy/page'
import ReviewsPage from '@/app/otzyvy/page'
import ContactsPage from '@/app/kontakty/page'
import NotFound from '@/app/not-found'
import PolicyPage from '@/app/politika/page'
import ConsentPage from '@/app/soglasie/page'
import DataProcessingPage from '@/app/obrabotka-dannyh/page'
import { staticRouteSkeletons } from '@/core/content/services/route-skeletons'
import { RouteSkeletonPage } from '@/ui/shell/route-skeleton-page'

const forbiddenVisibleCopy = [
  /publicationStatus/i,
  /Proof preview/i,
  /Claim guard/i,
  /Data boundary/i,
  /unsupported-hidden/i,
  /\/api\/leads\/test/i,
  /static Next export/i,
  /\bskeleton\b/i,
  /\brepresentative\b/i,
  /Target commercial page/i,
  /editorial intent/i,
  /REQUIRES_OWNER_DECISION/i,
  /foundation/i,
  /publication guard/i,
  /EPIC-\d+/i,
  /OD-\d+/i,
  /legal-review/i,
  /claim register/i,
  /Primary CTA/i,
  /Lead context/i,
  /Threat model/i,
  /Evidence boundary/i,
  /Permission contract/i,
  /Evidence contract/i,
  /permissionState/i,
  /blockers/i,
  /public release blocked/i,
] as const

function visibleText(markup: string) {
  return markup
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const renderedRoutes = [
  { route: '/', render: () => HomePage() },
  { route: '/impuls/', render: () => ImpulsProductPage() },
  { route: '/pixel/', render: () => PixelProductPage() },
  { route: '/zashchita/', render: () => ZashchitaProductPage() },
  { route: '/tarify/', render: () => <TariffsPage /> },
  { route: '/raschety/', render: () => <CalculationsPage /> },
  { route: '/keisy/', render: () => <CasesPage /> },
  { route: '/otzyvy/', render: () => <ReviewsPage /> },
  { route: '/kontakty/', render: () => <ContactsPage /> },
  { route: '/404', render: () => <NotFound /> },
  { route: '/politika/', render: () => <PolicyPage /> },
  { route: '/soglasie/', render: () => <ConsentPage /> },
  { route: '/obrabotka-dannyh/', render: () => <DataProcessingPage /> },
  ...staticRouteSkeletons.map((route) => ({
    route: route.path,
    render: () => <RouteSkeletonPage route={route} />,
  })),
] as const

describe('public route copy vocabulary', () => {
  it('keeps internal implementation vocabulary out of visible rendered copy', async () => {
    for (const routeCase of renderedRoutes) {
      const text = visibleText(renderToStaticMarkup(await routeCase.render()))

      for (const forbidden of forbiddenVisibleCopy) {
        expect(text, routeCase.route).not.toMatch(forbidden)
      }
    }
  })
})
