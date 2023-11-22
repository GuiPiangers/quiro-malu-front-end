import { AuthContextProvider } from '@/contexts/AuthContext'
import './globals.css'
import { Roboto } from 'next/font/google'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
})

export const metadata = {
  title: 'Quiro Malu',
  description: 'Sistema de agendamento e gestão de clínica',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={`${roboto.className} bg-slate-50`}>
        <AuthContextProvider>{children}</AuthContextProvider>
      </body>
    </html>
  )
}
