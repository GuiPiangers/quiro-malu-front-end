import Link from 'next/link'
import { Clock, ArrowLeft, Plus } from 'lucide-react'
import { Validate } from '@/services/api/Validate'
import { listBeforeScheduleMessages } from '@/services/message/message'
import CampaignListTable from './components/CampaignListTable'
import Button from '@/components/Button'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function BeforeScheduleTemplatesListPage() {
  const listData = await listBeforeScheduleMessages().then((res) =>
    Validate.isOk(res) ? res : undefined,
  )

  const campaigns = listData?.beforeScheduleMessages ?? []

  return (
    <div className="w-full max-w-screen-lg space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3">
          <Link
            href="/mensagens"
            className="flex w-fit items-center gap-1.5 text-sm text-slate-500 transition hover:text-main"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50">
              <Clock className="h-5 w-5 text-main" />
            </div>
            <h1 className="text-2xl font-semibold text-main">
              Mensagem antes de agendamento
            </h1>
          </div>
        </div>

        <Button color="green" asChild className="h-fit">
          <Link href="/mensagens/templates/antes-do-agendamento/criar">
            <Plus className="h-4 w-4" />
            Nova Campanha
          </Link>
        </Button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-main">
          Campanhas Cadastradas
        </h2>
        <CampaignListTable campaigns={campaigns} />
      </div>
    </div>
  )
}
