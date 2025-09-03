import { ListMessageResponse } from '@/services/message/message'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { Calendar } from 'lucide-react'
import { PiChatCircle, PiChatCircleThin } from 'react-icons/pi'

type MessageTableProps = {
  messageCampaignsData?: ListMessageResponse
}

export default function MessageTable({
  messageCampaignsData,
}: MessageTableProps) {
  const { messageCampaigns } = messageCampaignsData ?? {}
  return (
    // <Table.Root>
    //   <Table.Row columns={['1fr', 'auto']}>
    //     <Table.Head>Nome</Table.Head>
    //     <Table.Head>Status</Table.Head>
    //   </Table.Row>
    //   {messageCampaigns &&
    //     messageCampaigns.map(({ active, name, id }) => (
    //       <Table.Row columns={['1fr', 'auto']} key={id}>
    //         <Table.Cell>{name}</Table.Cell>

    //         <Table.Cell>{active ? 'Ativo' : 'Inativo'}</Table.Cell>
    //       </Table.Row>
    //     ))}
    // </Table.Root>
    <div className="grid gap-4 sm:grid-cols-2">
      {messageCampaigns &&
        messageCampaigns.map((messageCampaign) => (
          <Card
            key={messageCampaign.id}
            className="cursor-pointer overflow-hidden hover:bg-slate-50"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <CardTitle>{messageCampaign.name}</CardTitle>
                <div className="relative">
                  <div className=" absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs text-white">
                    {10}
                  </div>
                  <PiChatCircleThin size={24} />
                </div>
              </div>
              <CardDescription className="mt-1 flex items-center">
                <Calendar className="text-muted-foreground mr-1 h-4 w-4" />
                Created on
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="mb-3">
                <div className="mb-2 w-fit rounded-full bg-main px-2 py-0.5 text-xs font-medium text-white hover:bg-main-hover">
                  {messageCampaign.triggers.map((trigger) => trigger.event)}
                </div>
                <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">
                  {messageCampaign.templateMessage}
                </p>
              </div>
            </CardContent>
            {/* <CardFooter className="flex justify-between pt-0"></CardFooter> */}
          </Card>
        ))}
    </div>
  )
}
