import Header from '@/components/header/Header'
import SideBar from '@/components/sideBar/SlideBar'
import { SideBarContextProvider } from '@/contexts/SideBarContext'
import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <SideBarContextProvider>
      <div className="grid h-screen grid-rows-[auto_1fr]">
        <Header className="" />
        <div className="flex h-full">
          <SideBar />
          {children}
        </div>
      </div>
    </SideBarContextProvider>
  )
}
