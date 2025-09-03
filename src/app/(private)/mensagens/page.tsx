import { Box } from '@/components/box/Box'
import Button from '@/components/Button'
import SearchInput from '@/components/input/SearchInput'
import MessageTable from '@/components/message/MessageTable'
import { Validate } from '@/services/api/Validate'
import { listMessageCampaigns } from '@/services/message/message'
import Link from 'next/link'

export default async function MessagePage() {
  const data = await listMessageCampaigns().then((message) =>
    Validate.isOk(message) ? message : undefined,
  )
  return (
    <Box className="w-full max-w-screen-lg space-y-4">
      <div className=" flex flex-col gap-4 sm:flex-row">
        <SearchInput searchParam="" />
        <Button color="green" className="whitespace-nowrap" asChild>
          <Link href={'/mensagens/criar'}>Nova Campanha</Link>
        </Button>
      </div>
      <MessageTable messageCampaignsData={data} />
    </Box>
  )
}
