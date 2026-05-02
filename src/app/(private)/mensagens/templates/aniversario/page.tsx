import Link from 'next/link'
import { Cake, Plus } from 'lucide-react'
import { Validate } from '@/services/api/Validate'
import { listBirthdayMessages } from '@/services/message/birthdayMessage'
import { mapBirthdayDtoToResponse } from '@/services/message/birthdayMessageMapper'
import BirthdayCampaignListTable from './components/BirthdayCampaignListTable'
import Button from '@/components/Button'
import { Box } from '@/components/box/Box'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function BirthdayTemplatesListPage() {
  const listData = await listBirthdayMessages().then((res) =>
    Validate.isOk(res) ? res : undefined,
  )

  const campaigns = listData
    ? listData.items.map((dto) => mapBirthdayDtoToResponse(dto))
    : []

  return (
    <div className="w-full max-w-screen-lg space-y-6">
      <Box>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-4">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-main">
            <Cake /> Mensagens de aniversário
          </h2>
          <Button color="green" asChild className="h-fit w-full md:w-auto">
            <Link href="/mensagens/templates/aniversario/criar">
              <Plus className="h-4 w-4" />
              Nova Campanha
            </Link>
          </Button>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-slate-600">
          Será enviada a primeira campanha ativa, caso uma mensagem de
          aniversário já tenha sido enviada, as mensagens de outras campanhas
          não serão disparadas.
        </p>
      </Box>

      <Box>
        <BirthdayCampaignListTable campaigns={campaigns} />
      </Box>
    </div>
  )
}
