'use client'

import { Table } from '@/components/table'
import {
  NotificationDTO,
  setReadNotifications,
} from '@/services/notification/notification'
import { NotificationItem } from '../itens/NotificationItem'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import NotificationTypeSelect, {
  notificationsSelectTypes,
  NotificationTypeSelectProps,
} from '../notificationTypeSelect/NotificationTypeSelect'

export default function NotificationTable({
  notifications,
}: {
  notifications: NotificationDTO[]
}) {
  const [selectedType, setSelectedType] = useState<notificationsSelectTypes>()

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
    <div className="flex flex-col gap-4">
      <NotificationTypeSelect value={selectedType} setValue={setSelectedType} />

      <Table.Root>
        {notifications?.length === 0 && (
          <span>Você não tem nenhuma notificação!</span>
        )}
        {notifications?.map(
          ({ message, read, title, type, actionNeeded, id, params }) => (
            <NotificationItem
              id={id}
              type={type}
              key={id}
              notRead={read}
              actionNeeded={actionNeeded}
              message={message}
              title={title}
              params={params}
            />
          ),
        )}
      </Table.Root>
    </div>
  )
}
