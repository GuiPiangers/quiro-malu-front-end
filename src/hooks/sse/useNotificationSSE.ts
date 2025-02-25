import { NotificationDTO } from '@/services/notification/notification'
import { useSSE } from './useSSE'

export default function useNotificationSSE() {
  const HOST = process.env.NEXT_PUBLIC_HOST

  const data = useSSE<{
    notification: NotificationDTO
    totalNotRead: number
  }>(`${HOST}/notifications/connect`)

  const notification = data?.notification
  const totalNotRead = data?.totalNotRead

  return { notification, totalNotRead }
}
