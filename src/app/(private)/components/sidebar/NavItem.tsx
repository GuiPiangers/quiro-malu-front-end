'use client'

import Link from 'next/link'
import { Style } from './Style'
import { ReactNode } from 'react'
import useSidebarContext from '@/hooks/useSidebarContext'

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
  const { collapsed } = useSidebarContext()

  const { navItemStyle } = Style({ active, collapsed, className })
  return (
    <ul>
      <Link {...props} className={navItemStyle()}>
        {children}
      </Link>
    </ul>
  )
}
