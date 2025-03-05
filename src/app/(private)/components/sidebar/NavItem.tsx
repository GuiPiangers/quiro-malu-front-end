'use client'

import Link from 'next/link'
import { SidebarStyles } from './Style'
import { ElementType, ReactNode } from 'react'
import useToggleContext from '@/hooks/useToggleContext'
import { usePathname } from 'next/navigation'

type NavItemProps = {
  children: ReactNode
  icon?: ElementType
  className?: string
  href: string
  replace?: boolean
  scroll?: boolean
  prefetch?: boolean
}

export function NavItem({
  children,
  className,
  href,
  icon: Icon,
  ...props
}: NavItemProps) {
  const { collapsed } = useToggleContext()
  const active = href === usePathname()

  const { navItemStyle, navIconStyle } = SidebarStyles({
    active,
    collapsed,
    className,
  })
  return (
    <ul>
      <Link
        href={href}
        {...props}
        className={navItemStyle()}
        data-active={active}
      >
        {Icon && (
          <Icon
            size={24}
            className={navIconStyle({ className: 'font-bold' })}
          />
        )}
        {children}
      </Link>
    </ul>
  )
}
