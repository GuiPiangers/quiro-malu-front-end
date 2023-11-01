'use client'

import useSidebarContext from '@/hooks/useSidebarContext'
import { IoIosMenu } from 'react-icons/io'

export default function SidebarToggleBt() {
  const { toggle } = useSidebarContext()
  return (
    <button
      onClick={toggle}
      className="aspect-square rounded-full p-1 transition hover:bg-purple-500"
    >
      <IoIosMenu size={28} color="white" />
    </button>
  )
}
