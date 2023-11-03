'use client'

import useToggleContext from '@/hooks/useToggleContext'
import { IoIosMenu } from 'react-icons/io'

export default function SidebarToggleBt() {
  const { toggle } = useToggleContext()
  return (
    <button
      onClick={toggle}
      className="aspect-square rounded-full p-1 transition hover:bg-purple-500"
    >
      <IoIosMenu size={28} color="white" />
    </button>
  )
}
