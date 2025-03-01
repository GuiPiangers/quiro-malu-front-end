'use client'

import { Input } from '@/components/input'
import { notificationType } from '@/services/notification/notification'
import { Dispatch, SetStateAction } from 'react'

export type notificationsSelectTypes = notificationType | 'all'

export type NotificationTypeSelectProps = {
  value?: notificationsSelectTypes
  setValue: Dispatch<SetStateAction<notificationsSelectTypes | undefined>>
}

export default function NotificationTypeSelect({
  value = 'all',
  setValue,
}: NotificationTypeSelectProps) {
  return (
    <Input.Root>
      <Input.Label>Tipo de notificação:</Input.Label>
      <Input.Select
        value={value}
        defaultValue={'all'}
        onChange={(_, newValue) => {
          return setValue(newValue as notificationsSelectTypes)
        }}
      >
        <Input.Option value={'all'}>Todas</Input.Option>
        <Input.Option value={'sendMessage'}>Mensagem</Input.Option>
        <Input.Option value={'undo'}>Restaurar</Input.Option>
      </Input.Select>
    </Input.Root>
  )
}
