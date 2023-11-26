'use client'

import { ReactNode } from 'react'
import { VariantProps, tv } from 'tailwind-variants'

const calendarItemStyle = tv({
  slots: {
    calendarRoot: 'cursor-pointer border text-xs',
    calendarItemBody: 'flex h-8 items-center justify-center p-1.5',
    calendarItemHead:
      'flex items-center justify-center bg-main px-1 py-0.5 text-white',
  },
  variants: {
    selected: {
      true: {
        calendarItemBody: 'bg-orange-100',
      },
    },
    today: {
      true: {
        calendarItemBody: 'bg-blue-100',
      },
    },
    disable: {
      true: {
        calendarRoot: 'opacity-50',
      },
    },
  },
  compoundVariants: [
    {
      today: true,
      selected: true,
      className: { calendarItemBody: 'bg-blue-200' },
    },
  ],
})

type CalendarItemProps = {
  date: Date
  children?: ReactNode
  className?: string
  handleOnClick?(): void
} & Omit<VariantProps<typeof calendarItemStyle>, 'today'>

export default function CalendarItem({
  date,
  children,
  className,
  handleOnClick,
  disable,
  selected,
}: CalendarItemProps) {
  const { calendarItemBody, calendarItemHead, calendarRoot } =
    calendarItemStyle({
      selected,
      disable,
      today: date.toLocaleDateString() === new Date().toLocaleDateString(),
    })
  return (
    <button
      className={calendarRoot()}
      tabIndex={-1}
      onClick={handleOnClick || undefined}
    >
      <div className={calendarItemHead()}>{date.getDate()}</div>
      <div className={calendarItemBody()}>{children}</div>
    </button>
  )
}
