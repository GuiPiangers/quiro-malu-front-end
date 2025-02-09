'use client'

import Link from 'next/link'
import { ReactNode } from 'react'
import { NavPropsVariants, navStyles } from './Style'
import { usePathname } from 'next/navigation'

type NavItemProps = {
  href: string
  children: ReactNode
  className?: string
  replace?: boolean
} & NavPropsVariants

export default function NavItem({
  href,
  className,
  children,
  replace,
  variants,
}: NavItemProps) {
  const active = usePathname() === href
  const { NavItemStyles } = navStyles({ active, variants })

  return (
    <li>
      <Link
        href={href}
        className={NavItemStyles({ className })}
        replace={replace}
      >
        {children}
      </Link>
    </li>
  )
}
