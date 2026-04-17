'use client'

import PreviousButton from '../PreviousButton'
import { usePathname } from 'next/navigation'
import {
  composePreviousHref,
  composePreviousLabel,
  composeRouteTitle,
  type RouteTitleEntry,
} from './composeRouteTitle'

const routes: RouteTitleEntry[] = [
  { name: 'Home', path: '/' },
  {
    name: 'Agenda',
    path: '/scheduling',
    previousPath: '/',
    previousLabel: 'Início',
  },
  {
    name: 'Pacientes',
    path: '/patients',
    previousPath: '/',
    previousLabel: 'Início',
  },
  {
    name: 'Novo Paciente',
    path: '/patients/create',
    previousPath: '/patients',
    previousLabel: 'Pacientes',
  },
  {
    name: 'Evolução',
    path: '/patients/*/progress',
    previousPath: '/patients',
    previousLabel: 'Pacientes',
  },
  {
    name: 'Anamnese',
    path: '/patients/*/anamnesis',
    previousPath: '/patients',
    previousLabel: 'Pacientes',
  },
  {
    name: 'Exames',
    path: '/patients/*/exams',
    previousPath: '/patients',
    previousLabel: 'Pacientes',
  },
  {
    name: 'Diagnóstico',
    path: '/patients/*/diagnostic',
    previousPath: '/patients',
    previousLabel: 'Pacientes',
  },
  {
    name: 'Financeiro',
    path: '/patients/*/finance',
    previousPath: '/patients',
    previousLabel: 'Pacientes',
  },
  {
    name: 'Ficha do paciente',
    path: '/patients/*',
    previousPath: '/patients',
    previousLabel: 'Pacientes',
  },
  {
    name: 'Serviços',
    path: '/services',
    previousPath: '/',
    previousLabel: 'Início',
  },
  {
    name: 'Financeiro',
    path: '/finance',
    previousPath: '/',
    previousLabel: 'Início',
  },
  {
    name: 'Notificações',
    path: '/notifications',
    previousPath: '/',
    previousLabel: 'Início',
  },
  {
    name: 'Arquivos',
    path: '/arquivos',
    previousPath: '/',
    previousLabel: 'Início',
  },
  {
    name: 'Nova Campanha',
    path: '/mensagens/templates/antes-do-agendamento/criar',
    previousPath: '/mensagens/templates/antes-do-agendamento',
    previousLabel: 'Lembrete consulta',
  },
  {
    name: 'Nova Campanha',
    path: '/mensagens/templates/depois-do-agendamento/criar',
    previousPath: '/mensagens/templates/depois-do-agendamento',
    previousLabel: 'Após agendamento',
  },
  {
    name: 'Nova Campanha',
    path: '/mensagens/templates/aniversario/criar',
    previousPath: '/mensagens/templates/aniversario',
    previousLabel: 'Aniversário',
  },
  {
    name: 'Mensagens',
    path: '/mensagens/templates/antes-do-agendamento/*/*',
    previousPath: '/mensagens/templates/antes-do-agendamento/*',
    previousLabel: 'Lembrete consulta',
  },
  {
    name: 'Mensagens',
    path: '/mensagens/templates/depois-do-agendamento/*/*',
    previousPath: '/mensagens/templates/depois-do-agendamento/*',
    previousLabel: 'Após agendamento',
  },
  {
    name: 'Mensagens',
    path: '/mensagens/templates/aniversario/*/*',
    previousPath: '/mensagens/templates/aniversario/*',
    previousLabel: 'Aniversário',
  },
  {
    name: 'Mensagens',
    path: '/mensagens/templates/antes-do-agendamento',
    previousPath: '/mensagens',
    previousLabel: 'Mensagens',
  },
  {
    name: 'Mensagens',
    path: '/mensagens/templates/depois-do-agendamento',
    previousPath: '/mensagens',
    previousLabel: 'Mensagens',
  },
  {
    name: 'Mensagens',
    path: '/mensagens/templates/aniversario',
    previousPath: '/mensagens',
    previousLabel: 'Mensagens',
  },
  {
    name: 'Mensagens',
    path: '/mensagens/templates/*',
    previousPath: '/mensagens',
    previousLabel: 'Mensagens',
  },
  {
    name: 'Mensagens',
    path: '/mensagens/criar',
    previousPath: '/mensagens',
    previousLabel: 'Mensagens',
  },
  {
    name: 'Mensagens',
    path: '/mensagens/*',
    previousPath: '/mensagens',
    previousLabel: 'Mensagens',
  },
  {
    name: 'Mensagens',
    path: '/mensagens',
    previousPath: '/',
    previousLabel: 'Início',
  },
  {
    name: 'Mensagens',
    path: '/mensagens/**',
    previousPath: '/mensagens',
    previousLabel: 'Mensagens',
  },
]

export default function SubHeader() {
  const path = usePathname()
  const title = composeRouteTitle(path, routes)
  const rawPrevious = composePreviousHref(path, routes)
  const previousHref =
    rawPrevious && rawPrevious !== path ? rawPrevious : undefined
  const previousLabel = composePreviousLabel(path, routes)

  return (
    <div className="flex w-full flex-row-reverse justify-between gap-0 border-b border-slate-300 px-8 py-2 md:flex-row md:justify-start md:gap-6">
      <PreviousButton href={previousHref} previousLabel={previousLabel} />
      <h1 className="text-2xl font-bold text-main">{title}</h1>
    </div>
  )
}
