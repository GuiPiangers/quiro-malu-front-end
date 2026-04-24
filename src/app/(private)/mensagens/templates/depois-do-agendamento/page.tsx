import Link from 'next/link'
import { CalendarCheck, Plus } from 'lucide-react'
import { Validate } from '@/services/api/Validate'
import { listAfterScheduleMessages } from '@/services/message/afterScheduleMessage'
import { mapAfterScheduleDtoToResponse } from '@/services/message/afterScheduleMessageMapper'
import AfterScheduleCampaignListTable from './components/AfterScheduleCampaignListTable'
import Button from '@/components/Button'
import { Box } from '@/components/box/Box'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AfterScheduleTemplatesListPage() {
  const listData = await listAfterScheduleMessages().then((res) =>
    Validate.isOk(res) ? res : undefined,
  )

  const campaigns = listData
    ? listData.items.map((dto) => mapAfterScheduleDtoToResponse(dto))
    : []

  return (
    <div className="w-full max-w-screen-lg space-y-6">
      <Box>
        <div className="flex items-center justify-between gap-4">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-main">
            <CalendarCheck /> Mensagens após agendamento
          </h2>
          <Button color="green" asChild className="h-fit">
            <Link href="/mensagens/templates/depois-do-agendamento/criar">
              <Plus className="h-4 w-4" />
              Nova Campanha
            </Link>
          </Button>
        </div>
      </Box>

      <Box>
        <AfterScheduleCampaignListTable campaigns={campaigns} />
      </Box>
    </div>
  )
}
