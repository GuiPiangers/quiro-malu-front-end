import { HTMLAttributes } from 'react'
import { navStyles } from './Style'
import ScrollArea from '../scrollArea/ScrollArea'

type NavbarProps = HTMLAttributes<HTMLElement>

export default function Navbar({ children, className, ...props }: NavbarProps) {
  const { NavbarStyles } = navStyles()
  return (
    <ScrollArea className="h-12">
      <nav className="min-w-full max-w-xs" {...props}>
        <ul className={NavbarStyles({ className })}>{children}</ul>
      </nav>
    </ScrollArea>
  )
}
