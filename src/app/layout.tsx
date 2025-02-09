import './globals.css'
import { Poppins } from 'next/font/google'
import { Viewport } from 'next'
import QueryClientContext from '@/contexts/QueryClientProvider'
import { Toaster } from '@/components/ui/toaster'

const font = Poppins({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
})

export const metadata = {
  title: 'Quiro Malu',
  description: 'Sistema de agendamento e gestão de clínica',
  manifest: '/manifest.json',
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
