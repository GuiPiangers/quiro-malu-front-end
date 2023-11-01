import { Logo } from '@/components/logo'
import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

export default function AuthenticationLayout({ children }: LayoutProps) {
  return (
    <main className="grid w-screen h-screen place-items-center">
      <div className="flex gap-8 flex-wrap items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Logo.Root>
            <Logo.Image />
          </Logo.Root>
          <h1 className="text-xl font-medium">Sistema de gestão de clínica</h1>
        </div>
        {children}
      </div>
    </main>
  )
}
