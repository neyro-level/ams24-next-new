import type { Metadata } from 'next'
import './globals.css'

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
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}
