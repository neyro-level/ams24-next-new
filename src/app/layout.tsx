import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'

import { getSiteSettingsViewModel } from '@/core/content/services/view-models'
import { SiteShell } from '@/ui/shell/site-shell'

import './globals.css'

const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-app-sans',
  display: 'swap',
})

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSettingsViewModel()

  return {
    metadataBase: new URL(site.siteOrigin),
    title: site.defaultSeo.title,
    description: site.defaultSeo.description,
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className={manrope.variable}>
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  )
}
