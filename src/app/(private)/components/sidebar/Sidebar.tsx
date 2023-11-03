'use client'

import { CiCalendar, CiDollar, CiStethoscope, CiUser } from 'react-icons/ci'
import { Style } from './Style'
import { NavItem } from './NavItem'
import useToggleContext from '@/hooks/useToggleContext'

type SidebarProps = { className?: string }

export default function Sidebar({ className }: SidebarProps) {
  const { collapsed, toggle } = useToggleContext()
  const { SidebarStyle, sideWrapperStyle } = Style({ collapsed })

  return (
    <>
      <div onClick={toggle} className={sideWrapperStyle()}></div>
      <nav className={SidebarStyle({ className })}>
        <li className="list-none space-y-1">
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
        </li>
      </nav>
    </>
  )
}
