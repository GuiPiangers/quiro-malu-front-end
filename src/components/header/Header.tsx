import UserProfile from '../UserProfile'
import { Logo } from '../logo'
import { tv } from 'tailwind-variants'
import SideBarToggleBt from './SideBarToggleBt'

const HeaderStyle = tv({
  base: 'flex w-screen justify-between gap-2 bg-main px-4 py-2',
})

type HeaderProps = {
  className?: string
}

export default function Header({ className }: HeaderProps) {
  return (
    <header className={HeaderStyle({ className })}>
      <SideBarToggleBt />
      <Logo.Root>
        <Logo.Text color="white" className="h-6 w-fit" />
      </Logo.Root>
      <UserProfile />
    </header>
  )
}
