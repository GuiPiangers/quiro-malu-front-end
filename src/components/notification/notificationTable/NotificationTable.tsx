'use client'

import { Table } from '@/components/table'
import {
  deleteManyNotifications,
  NotificationDTO,
  setReadNotifications,
} from '@/services/notification/notification'
import { NotificationItem } from '../itens/NotificationItem'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import CheckGroup from '@/components/ui/checkGroup'
import Button from '@/components/Button'

export default function NotificationTable({
  notifications,
}: {
  notifications: NotificationDTO[]
}) {
  const notificationsChecked = useMemo(
    () =>
      notifications.reduce<Record<string, boolean>>((acc, notification) => {
        const newObject = { ...acc }
        newObject[notification.id] = false
        return newObject
      }, {}),
    [notifications],
  )

  const [checkNotifications, setCheckNotifications] =
    useState<Record<string, boolean>>(notificationsChecked)

  const everyCheckedNotificationsData = Object.values(checkNotifications).every(
    (value) => value,
  )

  function toggleCheckedEveryData() {
    const dataValues = Object.entries(checkNotifications).reduce(
      (acc, [key, value]) => {
        const newObject = { ...acc }
        newObject[key] = !everyCheckedNotificationsData
        return newObject
      },
      {} as { [key: string]: boolean },
    )

    setCheckNotifications(dataValues)
  }

  const handleSetCheckNotification = (
    notificationId: string,
    value: boolean,
  ) => {
    setCheckNotifications((notifications) =>
      notifications
        ? { ...notifications, [notificationId]: value }
        : notifications,
    )
  }

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
      <div className="flex items-center gap-2">
        <CheckGroup
          isChecked={everyCheckedNotificationsData}
          onClick={() => {
            toggleCheckedEveryData()
          }}
        />
        <Button
          size="small"
          variant="outline"
          color="black"
          disabled={!Object.values(checkNotifications).some((value) => value)}
          onClick={async () => {
            const deleteNotificationsValue = Object.entries(checkNotifications)
              .filter(([_, value]) => value)
              .map(([key]) => key)

            await deleteManyNotifications({
              notificationsId: deleteNotificationsValue,
            })
          }}
        >
          Excluir
        </Button>
        {/* <NotificationTypeSelect
          value={selectedType}
          setValue={setSelectedType}
        /> */}
      </div>

      <Table.Root>
        {notifications?.length === 0 && (
          <span>Você não tem nenhuma notificação!</span>
        )}
        {notifications?.map(
          ({
            message,
            read,
            title,
            type,
            actionNeeded,
            id,
            params,
            createdAt,
          }) => (
            <NotificationItem
              onCheckedChange={(value) => {
                handleSetCheckNotification(id, !!value)
              }}
              checked={checkNotifications ? checkNotifications[id] : false}
              id={id}
              type={type}
              key={id}
              notRead={read}
              actionNeeded={actionNeeded}
              message={message}
              title={title}
              params={params}
              createdAt={createdAt}
            />
          ),
        )}
      </Table.Root>
    </div>
  )
}
