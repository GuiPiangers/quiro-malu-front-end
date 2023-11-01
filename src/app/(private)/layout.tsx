import Header from '@/app/(private)/components/header/Header'
import Sidebar from '@/app/(private)/components/sidebar/Sidebar'
import { SidebarContextProvider } from '@/contexts/SidebarContext'
import { ReactNode } from 'react'
import PreviousButton from './components/PreviousButton'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <SidebarContextProvider>
      <div className="grid h-screen grid-rows-[auto_1fr]">
        <Header className="" />
        <div className="flex h-full">
          <Sidebar />
          <main className="w-full">
            <div className="flex w-full gap-6 border-b border-zinc-300 px-8 py-2">
              <PreviousButton />
              <h1 className="text-2xl font-bold text-main">Pacientes</h1>
            </div>

            <div className="flex w-full items-center justify-center px-4 py-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarContextProvider>
  )
}
