'use client'

import {
  CiCalendar,
  CiDollar,
  CiStethoscope,
  CiUser,
  CiHome,
  CiFileOn,
} from 'react-icons/ci'
import { SidebarStyles } from './Style'
import { NavItem } from './NavItem'
import useToggleContext from '@/hooks/useToggleContext'

type SidebarProps = { className?: string }

export default function Sidebar({ className }: SidebarProps) {
  const { collapsed, toggle } = useToggleContext()
  const { SidebarStyle, sideWrapperStyle } = SidebarStyles({
    collapsed,
  })

  return (
    <>
      <div onClick={toggle} className={sideWrapperStyle()}></div>
      <nav className={SidebarStyle({ className })}>
        <li className="list-none space-y-1">
          <NavItem href="/" icon={CiHome}>
            Home
          </NavItem>
          <NavItem href="/scheduling" icon={CiCalendar}>
            Agenda
          </NavItem>
          <NavItem href="/patients" icon={CiUser}>
            Pacientes
          </NavItem>
          <NavItem href="/services" icon={CiStethoscope}>
            Serviços
          </NavItem>
          <NavItem href="/finance" icon={CiDollar}>
            Financeiro
          </NavItem>
          <NavItem href="/arquivos" icon={CiFileOn}>
            arquivos
          </NavItem>
        </li>
      </nav>
    </>
  )
}
