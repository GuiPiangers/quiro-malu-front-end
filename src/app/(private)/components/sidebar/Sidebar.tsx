'use client'

import {
  CiCalendar,
  CiDollar,
  CiStethoscope,
  CiUser,
  CiHome,
  CiFileOn,
  CiSettings,
} from 'react-icons/ci'
import { SidebarStyles } from './Style'
import { NavItem } from './NavItem'
import { NavMensagensGroup } from './NavMensagensGroup'
import useToggleContext from '@/hooks/useToggleContext'
import { useModuleAccess } from '@/hooks/useAccess'

type SidebarProps = { className?: string }

export default function Sidebar({ className }: SidebarProps) {
  const { collapsed, toggle } = useToggleContext()
  const canAccessEvents = useModuleAccess('events')
  const canAccessPatients = useModuleAccess('patients')
  const canAccessServices = useModuleAccess('services')
  const canAccessFinance = useModuleAccess('finance')
  const canAccessMessages = useModuleAccess('messages')
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
          {canAccessEvents && (
            <NavItem href="/scheduling" icon={CiCalendar}>
              Agenda
            </NavItem>
          )}
          {canAccessPatients && (
            <NavItem href="/patients" icon={CiUser}>
              Pacientes
            </NavItem>
          )}
          {canAccessServices && (
            <NavItem href="/services" icon={CiStethoscope}>
              Serviços
            </NavItem>
          )}
          {canAccessFinance && (
            <NavItem href="/finance" icon={CiDollar}>
              Financeiro
            </NavItem>
          )}
          {canAccessMessages && <NavMensagensGroup />}
        </li>
      </nav>
    </>
  )
}
