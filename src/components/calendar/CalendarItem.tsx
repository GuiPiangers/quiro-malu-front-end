'use client'

import DateTime from '@/utils/Date'
import { Dispatch, ReactNode, SetStateAction, useEffect, useRef } from 'react'
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
    focused: {
      true: {
        calendarRoot:
          'focus:z-[2] focus:outline focus:outline-1 focus:outline-blue-500 focus:ring-2 focus:ring-blue-200',
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
  focusDate?: Date
  setDate?: Dispatch<SetStateAction<Date>>
  handleOnClick?(): void
} & Omit<VariantProps<typeof calendarItemStyle>, 'today'>

export default function CalendarItem({
  date,
  children,
  handleOnClick,
  setDate,
  focusDate,
  focused,
  disable,
  selected,
}: CalendarItemProps) {
  const { calendarItemBody, calendarItemHead, calendarRoot } =
    calendarItemStyle({
      selected,
      disable,
      focused,
      today: date.toLocaleDateString() === new Date().toLocaleDateString(),
    })

  const itemRef = useRef<HTMLButtonElement>(null)

  const changeDate = (number: number) => {
    const nextDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + number,
    )
    if (setDate !== undefined) setDate(nextDate)
  }

  useEffect(() => {
    if (focusDate) {
      if (DateTime.getIsoDate(date) === DateTime.getIsoDate(focusDate))
        itemRef.current?.focus()
    }
  }, [date, focusDate])
  return (
    <button
      ref={itemRef}
      className={calendarRoot()}
      tabIndex={focused ? 0 : -1}
      onClick={handleOnClick || undefined}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') {
          e.preventDefault()
          changeDate(1)
        }
        if (e.key === 'ArrowLeft') {
          e.preventDefault()
          changeDate(-1)
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault()
          changeDate(-7)
        }
        if (e.key === 'ArrowDown') {
          e.preventDefault()
          changeDate(7)
        }
      }}
    >
      <div className={calendarItemHead()}>{date.getDate()}</div>
      <div className={calendarItemBody()}>{children}</div>
    </button>
  )
}
