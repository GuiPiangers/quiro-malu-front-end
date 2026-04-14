'use client'

import PreviousButton from '../PreviousButton'
import { usePathname } from 'next/navigation'
import { composeRouteTitle, type RouteTitleEntry } from './composeRouteTitle'

const routes: RouteTitleEntry[] = [
  { name: 'Home', path: '/' },
  { name: 'Agenda', path: '/scheduling' },
  { name: 'Pacientes', path: '/patients' },
  { name: 'Novo Paciente', path: '/patients/create' },
  { name: 'Evolução', path: '/patients/*/progress' },
  { name: 'Anamnese', path: '/patients/*/anamnesis' },
  { name: 'Exames', path: '/patients/*/exams' },
  { name: 'Diagnóstico', path: '/patients/*/diagnostic' },
  { name: 'Financeiro', path: '/patients/*/finance' },
  { name: 'Ficha do paciente', path: '/patients/*' },
  { name: 'Serviços', path: '/services' },
  { name: 'Financeiro', path: '/finance' },
  { name: 'Notificações', path: '/notifications' },
  { name: 'Arquivos', path: '/arquivos' },
  {
    name: 'Nova Campanha',
    path: '/mensagens/templates/antes-do-agendamento/criar',
  },
  { name: 'Mensagens', path: '/mensagens/**' },
]

export default function SubHeader() {
  const path = usePathname()
  const title = composeRouteTitle(path, routes)

  return (
    <div className="flex w-full gap-6 border-b border-slate-300 px-8 py-2">
      <PreviousButton />
      <h1 className="text-2xl font-bold text-main">{title}</h1>
    </div>
  )
}
