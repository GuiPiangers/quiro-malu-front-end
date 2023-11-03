'use client'

import Link from 'next/link'
import { SidebarStyles } from './Style'
import { ReactNode } from 'react'
import useToggleContext from '@/hooks/useToggleContext'

type NavItemProps = {
  children: ReactNode
  className?: string
  href: string
  active?: boolean
  replace?: boolean
  scroll?: boolean
  prefetch?: boolean
}

export function NavItem({
  children,
  active,
  className,
  ...props
}: NavItemProps) {
  const { collapsed } = useToggleContext()

  const { navItemStyle } = SidebarStyles({ active, collapsed, className })
  return (
    <ul>
      <Link {...props} className={navItemStyle()}>
        {children}
      </Link>
    </ul>
  )
}
