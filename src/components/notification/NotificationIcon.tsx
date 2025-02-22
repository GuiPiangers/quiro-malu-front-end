'use client'

import useNotificationContext from '@/hooks/useNotificationContext'
import { IoMdNotificationsOutline } from 'react-icons/io'
import { twMerge } from 'tailwind-merge'

type NotificationIconProps = {
  className?: string
}

export default function NotificationIcon({ className }: NotificationIconProps) {
  const { totalNotRead } = useNotificationContext()
  return (
    <div className="cursor-pointer rounded-full p-1 hover:bg-white hover:bg-opacity-20">
      <div className="relative">
        <IoMdNotificationsOutline
          size={26}
          className={twMerge('text-white', className)}
        />
        {!!totalNotRead && (
          <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs text-white">
            {totalNotRead}
          </div>
        )}
      </div>
    </div>
  )
}
