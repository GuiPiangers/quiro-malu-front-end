import Header from '@/app/(private)/components/header/Header'
import Sidebar from '@/app/(private)/components/sidebar/Sidebar'
import { ToggleContextProvider } from '@/contexts/ToggleContext'
import { ReactNode } from 'react'
import SubHeader from './components/subHeader/SubHeader'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <ToggleContextProvider>
      <div className="grid h-screen grid-rows-[auto_1fr]">
        <Header className="" />
        <div className="flex h-full">
          <Sidebar />
          <main className="w-full">
            <SubHeader />
            <div className="flex w-full items-center justify-center px-4 py-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ToggleContextProvider>
  )
}
