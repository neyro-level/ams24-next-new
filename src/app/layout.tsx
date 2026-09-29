import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import './globals.css'

const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-app-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://ams24.ru'),
  title: {
    default: 'Импульс — маркетинговые продукты АМС',
    template: '%s | Импульс',
  },
  description: 'Новый статический сайт платформы маркетинговых продуктов «Импульс».',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className={manrope.variable}>
      <body>{children}</body>
    </html>
  )
}
