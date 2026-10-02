import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'

import { getRequiredSiteSettings } from '@/core/content/services/site-settings'
import { buildMetadata } from '@/core/seo'
import { SiteShell } from '@/ui/shell/site-shell'

import { AnalyticsBridge } from './_integrations/analytics-bridge'

import './globals.css'

const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-app-sans',
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const site = await getRequiredSiteSettings()
  return { metadataBase: new URL(site.domain), ...buildMetadata(undefined, site) }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className={manrope.variable}>
      <body>
        <AnalyticsBridge />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  )
}
