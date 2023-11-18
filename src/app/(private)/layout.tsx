import Header from '@/app/(private)/components/header/Header'
import Sidebar from '@/app/(private)/components/sidebar/Sidebar'
import { ToggleContextProvider } from '@/contexts/ToggleContext'
import { ReactNode } from 'react'
import SubHeader from './components/subHeader/SubHeader'
import Snackbar from '@/components/snackbar/Snackbar'
import ScrollArea from '@/components/scrollArea/ScrollArea'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <ToggleContextProvider>
      <div className="grid h-screen grid-rows-[auto_1fr]">
        <Header />
        <div className="flex h-full w-full">
          <Sidebar />
          <ScrollArea className="h-[calc(100vh-3.25rem)]">
            <SubHeader />
            <div className="flex w-full items-center justify-center px-4 py-6">
              <Snackbar>{children}</Snackbar>
            </div>
          </ScrollArea>
        </div>
      </div>
    </ToggleContextProvider>
  )
}
