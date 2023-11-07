import { AuthContextProvider } from '@/contexts/AuthContext'
import './globals.css'
import { Poppins } from 'next/font/google'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600'],
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
      <body className={`${poppins.className} bg-slate-50`}>
        <AuthContextProvider>{children}</AuthContextProvider>
      </body>
    </html>
  )
}
