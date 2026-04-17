import Link from 'next/link'
import { Cake, Plus } from 'lucide-react'
import { Validate } from '@/services/api/Validate'
import { listBirthdayMessages } from '@/services/message/birthdayMessage'
import BirthdayCampaignListTable from './components/BirthdayCampaignListTable'
import Button from '@/components/Button'
import { Box } from '@/components/box/Box'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function BirthdayTemplatesListPage() {
  const listData = await listBirthdayMessages().then((res) =>
    Validate.isOk(res) ? res : undefined,
  )

  const campaigns = listData?.items ?? []

  return (
    <div className="w-full max-w-screen-lg space-y-6">
      <Box>
        <div className="flex items-center justify-between gap-4">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-main">
            <Cake /> Mensagens de aniversário
          </h2>
          <Button color="green" asChild className="h-fit">
            <Link href="/mensagens/templates/aniversario/criar">
              <Plus className="h-4 w-4" />
              Nova Campanha
            </Link>
          </Button>
        </div>
      </Box>

      <Box>
        <BirthdayCampaignListTable campaigns={campaigns} />
      </Box>
    </div>
  )
}
