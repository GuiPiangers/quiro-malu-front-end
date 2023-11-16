import { HTMLAttributes } from 'react'
import { navStyles } from './Style'

type NavbarProps = HTMLAttributes<HTMLElement>

export default function Navbar({ children, className, ...props }: NavbarProps) {
  const { NavbarStyles } = navStyles()
  return (
    <nav className="min-w-full max-w-xs" {...props}>
      <ul className={NavbarStyles({ className })}>{children}</ul>
    </nav>
  )
}
