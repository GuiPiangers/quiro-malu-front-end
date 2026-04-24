'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { IoChevronDown } from 'react-icons/io5'
import { PiChatCircleThin } from 'react-icons/pi'

import useToggleContext from '@/hooks/useToggleContext'
import { SidebarStyles } from './Style'

function pathIsCampanhas(pathname: string) {
  return pathname === '/mensagens' || pathname.startsWith('/mensagens/')
}

function pathIsListasEnvio(pathname: string) {
  return pathname === '/lista-envio' || pathname.startsWith('/lista-envio/')
}

export function NavMensagensGroup() {
  const pathname = usePathname()
  const { collapsed } = useToggleContext()
  const campanhasActive = pathIsCampanhas(pathname)
  const listasActive = pathIsListasEnvio(pathname)
  const groupActive = campanhasActive || listasActive
  const [open, setOpen] = useState(groupActive)

  useEffect(() => {
    if (groupActive) setOpen(true)
  }, [groupActive])

  const { navItemStyle, navIconStyle } = SidebarStyles({
    active: groupActive,
    collapsed,
  })

  const subLinkClass =
    'flex w-full items-center rounded-md px-2 py-1.5 text-sm text-black transition hover:bg-slate-200'

  return (
    <ul className="list-none">
      <li>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={navItemStyle()}
          data-active={groupActive}
          aria-expanded={open}
        >
          <PiChatCircleThin
            size={24}
            className={navIconStyle({ className: 'font-bold' })}
          />
          <span className="min-w-0 flex-1 text-left">Mensagens</span>
          <IoChevronDown
            className={`h-4 w-4 shrink-0 transition-transform ${
              open ? 'rotate-180' : ''
            }`}
            aria-hidden
          />
        </button>
        {open ? (
          <ul className="ml-2 mt-1 space-y-0.5 border-l border-slate-200 pl-3">
            <li>
              <Link
                href="/mensagens"
                className={`${subLinkClass} ${
                  campanhasActive
                    ? 'bg-slate-200 font-medium hover:bg-slate-100'
                    : ''
                }`}
                data-active={campanhasActive}
              >
                Campanhas
              </Link>
            </li>
            <li>
              <Link
                href="/lista-envio"
                className={`${subLinkClass} ${
                  listasActive
                    ? 'bg-slate-200 font-medium hover:bg-slate-100'
                    : ''
                }`}
                data-active={listasActive}
              >
                Listas de envio
              </Link>
            </li>
          </ul>
        ) : null}
      </li>
    </ul>
  )
}
