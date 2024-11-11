import { Logo } from '@/components/logo'
import Snackbar from '@/components/snackbar/Snackbar'
import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

export default function AuthenticationLayout({ children }: LayoutProps) {
  return (
    <main className="h-lvh grid w-full place-items-center">
      <Snackbar>
        <div className="flex flex-wrap items-center justify-center gap-8">
          <div className="flex flex-col items-center gap-2">
            <Logo.Root>
              <Logo.Image />
            </Logo.Root>
            <h1 className="text-xl font-medium">
              Sistema de gestão de clínica
            </h1>
          </div>
          {children}
        </div>
      </Snackbar>
    </main>
  )
}
