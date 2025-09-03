import { Box } from '@/components/box/Box'
import { titleStyles } from '@/components/form/Styles'
import MessageForm from '@/components/message/messageForm'
import { createMessageCampaigns } from '@/services/message/message'

export default function CreateMessageCampaign() {
  return <MessageForm action={createMessageCampaigns} />
}
