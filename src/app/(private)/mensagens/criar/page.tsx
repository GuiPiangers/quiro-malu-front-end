import MessageForm from '@/components/message/messageForm'
import { createMessageCampaigns } from '@/services/message/beforeScheduleMessage'

export default function CreateMessageCampaign() {
  return <MessageForm action={createMessageCampaigns} />
}
