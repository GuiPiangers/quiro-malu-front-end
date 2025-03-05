import { Box } from '@/components/box/Box'
import { titleStyles } from '@/components/form/Styles'

export default function CreateMessageCampaign() {
  return (
    <Box className="w-full max-w-screen-lg space-y-4">
      <h2 id="new-message-campaign" className={titleStyles()}>
        Nova campanha de mensagens
      </h2>
    </Box>
  )
}
