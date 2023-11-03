'use client'

import PreviousButton from '../PreviousButton'
import { usePathname } from 'next/navigation'

const routes = [
  { name: 'Home', path: '/' },
  { name: 'Agenda', path: '/scheduling' },
  { name: 'Pacientes', path: '/patients' },
  { name: 'Serviços', path: '/services' },
  { name: 'Financeiro', path: '/finance' },
]

export default function SubHeader() {
  const path = usePathname()
  const title = routes.find((route) => route.path === path)?.name

  return (
    <div className="flex w-full gap-6 border-b border-zinc-300 px-8 py-2">
      <PreviousButton />
      <h1 className="text-2xl font-bold text-main">{title}</h1>
    </div>
  )
}
