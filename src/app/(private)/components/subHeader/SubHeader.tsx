'use client'

import PreviousButton from '../PreviousButton'
import { usePathname } from 'next/navigation'

const routes = [
  { name: 'Home', path: '/' },
  { name: 'Agenda', path: '/scheduling' },
  { name: 'Pacientes', path: '/patients' },
  { name: 'Novo Paciente', path: '/patients/create' },
  { name: 'Ficha do paciente', path: '/patients/*' },
  { name: 'Evolução', path: '/patients/*/progress' },
  { name: 'Anamnese', path: '/patients/*/anamnesis' },
  { name: 'Exames', path: '/patients/*/exams' },
  { name: 'Diagnóstico', path: '/patients/*/diagnostic' },
  { name: 'Financeiro', path: '/patients/*/finance' },
  { name: 'Serviços', path: '/services' },
  { name: 'Financeiro', path: '/finance' },
]

export default function SubHeader() {
  const path = usePathname()
  const title = routes.find((route) => {
    const routeArray = route.path.split('/')
    const pathArray = path.split('/')
    const index = routeArray.findIndex((route) => route === '*')

    if (index >= 0) {
      const routeSliced = routeArray.filter((_, i) => i !== index)
      const pathSliced = pathArray.filter((_, i) => i !== index)

      return routeSliced.join('/') === pathSliced.join('/')
    }

    return path === route.path
  })?.name
  return (
    <div className="flex w-full gap-6 border-b border-slate-300 px-8 py-2">
      <PreviousButton />
      <h1 className="text-2xl font-bold text-main">{title}</h1>
    </div>
  )
}
