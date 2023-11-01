'use client'

import { CiCalendar, CiDollar, CiStethoscope, CiUser } from 'react-icons/ci'
import { Style } from './Style'
import { NavItem } from './NavItem'
import useSideBarContext from '@/hooks/useSideBarContext'

type SideBarProps = { className?: string }

export default function SideBar({ className }: SideBarProps) {
  const { collapsed, toggle } = useSideBarContext()
  const { sideBarStyle, sideWrapperStyle } = Style({ collapsed })

  return (
    <>
      <div onClick={toggle} className={sideWrapperStyle()}></div>
      <nav className={sideBarStyle({ className })}>
        <NavItem active href="/patients">
          {<CiCalendar size={24} />}
          Agenda
        </NavItem>
        <NavItem href="/patients">
          <CiUser size={24} />
          Pacientes
        </NavItem>
        <NavItem href="/patients">
          <CiStethoscope size={24} />
          Serviços
        </NavItem>
        <NavItem href="/patients">
          <CiDollar size={24} />
          Financeiro
        </NavItem>
      </nav>
    </>
  )
}
