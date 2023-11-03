'use client'

import { CiCalendar, CiDollar, CiStethoscope, CiUser } from 'react-icons/ci'
import { SidebarStyles } from './Style'
import { NavItem } from './NavItem'
import useToggleContext from '@/hooks/useToggleContext'
import { usePathname } from 'next/navigation'

type SidebarProps = { className?: string }

export default function Sidebar({ className }: SidebarProps) {
  const { collapsed, toggle } = useToggleContext()
  const { SidebarStyle, sideWrapperStyle } = SidebarStyles({ collapsed })

  return (
    <>
      <div onClick={toggle} className={sideWrapperStyle()}></div>
      <nav className={SidebarStyle({ className })}>
        <li className="list-none space-y-1">
          <NavItem href="/scheduling">
            {<CiCalendar size={24} />}
            Agenda
          </NavItem>
          <NavItem href="/patients">
            <CiUser size={24} />
            Pacientes
          </NavItem>
          <NavItem href="/services">
            <CiStethoscope size={24} />
            Serviços
          </NavItem>
          <NavItem href="/finance">
            <CiDollar size={24} />
            Financeiro
          </NavItem>
        </li>
      </nav>
    </>
  )
}
