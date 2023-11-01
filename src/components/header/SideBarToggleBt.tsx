'use client'

import useSideBarContext from '@/hooks/useSideBarContext'
import { IoIosMenu } from 'react-icons/io'

export default function SideBarToggleBt() {
  const { toggle } = useSideBarContext()
  return (
    <button
      onClick={toggle}
      className="aspect-square rounded-full p-1 transition hover:bg-purple-500"
    >
      <IoIosMenu size={28} color="white" />
    </button>
  )
}
