import UserProfile from '../UserProfile'
import { Logo } from '../../../../components/logo'
import { tv } from 'tailwind-variants'
import SidebarToggleBt from './SidebarToggleBt'

const HeaderStyle = tv({
  base: 'flex w-full justify-between gap-2 bg-main px-4 py-2',
})

type HeaderProps = {
  className?: string
}

export default function Header({ className }: HeaderProps) {
  return (
    <header className={HeaderStyle({ className })}>
      <SidebarToggleBt />
      <Logo.Root>
        <Logo.Text color="white" className="h-6 w-fit" />
      </Logo.Root>
      <UserProfile />
    </header>
  )
}
