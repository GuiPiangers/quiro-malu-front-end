import Link from 'next/link'
import { Clock, Plus } from 'lucide-react'
import { Validate } from '@/services/api/Validate'
import { listBeforeScheduleMessages } from '@/services/message/beforeScheduleMessage'
import { mapBeforeScheduleDtoToResponse } from '@/services/message/beforeScheduleMessageMapper'
import CampaignListTable from './components/CampaignListTable'
import Button from '@/components/Button'
import { Box } from '@/components/box/Box'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function BeforeScheduleTemplatesListPage() {
  const listData = await listBeforeScheduleMessages().then((res) =>
    Validate.isOk(res) ? res : undefined,
  )

  const campaigns = listData
    ? listData.items.map((dto) => mapBeforeScheduleDtoToResponse(dto))
    : []

  return (
    <div className="w-full max-w-screen-lg space-y-6">
      {/* Header */}
      <Box>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-main">
            <Clock /> Mensagens antes de agendamento
          </h2>
          <Button color="green" asChild className="h-fit w-full md:w-auto">
            <Link href="/mensagens/templates/antes-do-agendamento/criar">
              <Plus className="h-4 w-4" />
              Nova Campanha
            </Link>
          </Button>
        </div>
      </Box>

      <Box>
        <CampaignListTable campaigns={campaigns} />
      </Box>
    </div>
  )
}
