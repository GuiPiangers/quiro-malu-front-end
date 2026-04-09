import Link from 'next/link'
import { ArrowLeft, Clock } from 'lucide-react'
import BeforeScheduleForm from '../components/BeforeScheduleForm'

export default function CreateBeforeScheduleCampaignPage() {
  return (
    <div className="w-full max-w-screen-lg space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <Link
          href="/mensagens/templates/antes-do-agendamento"
          className="flex w-fit items-center gap-1.5 text-sm text-slate-500 transition hover:text-main"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50">
            <Clock className="h-5 w-5 text-main" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-main">
              Mensagem antes de agendamento
            </h1>
            <p className="text-sm text-slate-500">Cadastrar nova campanha</p>
          </div>
        </div>
      </div>

      <BeforeScheduleForm />
    </div>
  )
}
