'use client'

import Link from 'next/link'
import { SidebarStyles } from './Style'
import { ReactNode } from 'react'
import useToggleContext from '@/hooks/useToggleContext'
import { usePathname } from 'next/navigation'

type NavItemProps = {
  children: ReactNode
  className?: string
  href: string
  replace?: boolean
  scroll?: boolean
  prefetch?: boolean
}

export function NavItem({ children, className, href, ...props }: NavItemProps) {
  const { collapsed } = useToggleContext()
  const active = href === usePathname()

  const { navItemStyle } = SidebarStyles({ active, collapsed, className })
  return (
    <ul>
      <Link href={href} {...props} className={navItemStyle()}>
        {children}
      </Link>
    </ul>
  )
}
