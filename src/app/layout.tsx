import './globals.css'
import { Poppins } from 'next/font/google'
import { Metadata, Viewport } from 'next'
import QueryClientContext from '@/contexts/QueryClientProvider'
import { Toaster } from '@/components/ui/toaster'

const font = Poppins({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
})

export const metadata: Metadata = {
  title: 'Quiro Malu',
  description: 'Sistema de agendamento e gestão de clínica',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon192x192.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={`${font.className} bg-slate-50`}>
        <QueryClientContext>{children}</QueryClientContext>
        <Toaster />
      </body>
    </html>
  )
}
