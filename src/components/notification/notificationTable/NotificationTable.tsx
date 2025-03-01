'use client'

import { Table } from '@/components/table'
import {
  NotificationDTO,
  setReadNotifications,
} from '@/services/notification/notification'
import { NotificationItem } from '../itens/NotificationItem'
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function NotificationTable({
  notifications,
}: {
  notifications: NotificationDTO[]
}) {
  const router = useRouter()

  const notificationsRead = useRef<NotificationDTO[]>()

  useEffect(() => {
    return () => {
      if (notificationsRead.current) {
        setReadNotifications(notificationsRead.current)
        router.refresh()
      } else {
        notificationsRead.current = notifications
      }
    }
  }, [])

  return (
    <Table.Root>
      {notifications?.length === 0 && (
        <span>Você não tem nenhuma notificação!</span>
      )}
      {notifications?.map(
        ({ message, read, title, type, actionNeeded, id }) => (
          <NotificationItem
            type={type}
            key={id}
            notRead={read}
            actionNeeded={actionNeeded}
            message={message}
            title={title}
          />
        ),
      )}
    </Table.Root>
  )
}
