'use client'

import Link from 'next/link'
import { ReactNode } from 'react'
import { navStyles } from './Style'
import { usePathname } from 'next/navigation'

type NavItemProps = {
  href: string
  children: ReactNode
  className?: string
}

export default function NavItem({ href, className, children }: NavItemProps) {
  const active = usePathname() === href
  const { NavItemStyles } = navStyles({ active })

  return (
    <li>
      <Link href={href} className={NavItemStyles({ className })}>
        {children}
      </Link>
    </li>
  )
}
