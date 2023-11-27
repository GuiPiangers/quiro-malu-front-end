'use client'

import { useCallback, useEffect, useState } from 'react'
import CalendarItem from './CalendarItem'
import { RxCaretDown } from 'react-icons/rx'
import { useRouter, useSearchParams } from 'next/navigation'
import Button from '../Button'
import DateTime from '@/utils/Date'

export default function Calendar() {
  const router = useRouter()
  const [date, setDate] = useState(new Date())
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
  const selectedDate =
    useSearchParams().get('date') || DateTime.getIsoDate(new Date())

  const nextMonth = () =>
    setDate(new Date(date.getFullYear(), date.getMonth() + 1))
  const prevMonth = () =>
    setDate(new Date(date.getFullYear(), date.getMonth() - 1))

  useEffect(() => {
    const newSelectedDate = new Date(
      +selectedDate.substring(0, 4),
      +selectedDate.substring(5, 7) - 1,
      +selectedDate.substring(8, 10),
    )
    if (newSelectedDate.getMonth() !== date.getMonth())
      setDate(new Date(newSelectedDate))
  }, [selectedDate])

  const changeDate = (date: Date) => {
    router.replace(`?date=${DateTime.getIsoDate(date)}`)
  }

  const month = date.getMonth()
  const year = date.getFullYear()

  const daysInTheMonth = useCallback(() => {
    const list = []
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(year, month, day)

      list.push(dayDate)
    }
    return list
  }, [month, year])

  const lastDaysOfLastMonth = useCallback(() => {
    const list = []
    const firstOfTheWeek = new Date(year, month, 1).getDay()
    const lastMonth = month === 0 ? 11 : month - 1
    const yearOfLastMonth = lastMonth === 11 ? year - 1 : year
    const numDaysLastMonth = new Date(
      yearOfLastMonth,
      lastMonth + 1,
      0,
    ).getDate()

    for (let i = firstOfTheWeek - 1; i >= 0; i--) {
      const dayDate = new Date(year, lastMonth, numDaysLastMonth - i)
      list.push(dayDate)
    }
    return list
  }, [month, year])

  const generateCalendar = () => (
    <div className="grid grid-cols-7">
      {weekDays.map((weekDay) => (
        <div className="mb-1 text-center text-sm" key={weekDay}>
          {weekDay}
        </div>
      ))}
      {lastDaysOfLastMonth().map((day) => (
        <CalendarItem
          key={day.getTime()}
          date={day}
          disable
          handleOnClick={() => changeDate(day)}
        />
      ))}
      {daysInTheMonth().map((day) => (
        <CalendarItem
          key={day.getTime()}
          date={day}
          selected={selectedDate === DateTime.getIsoDate(day)}
          handleOnClick={() => changeDate(day)}
        />
      ))}
    </div>
  )

  return (
    <>
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <button onClick={prevMonth}>
            <RxCaretDown
              size={24}
              className="rotate-90 cursor-pointer rounded text-main hover:bg-slate-100"
            />
          </button>

          <span className="text-lg font-semibold text-main">
            {date.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
          </span>

          <button onClick={nextMonth}>
            <RxCaretDown
              size={24}
              className="-rotate-90 cursor-pointer rounded text-main hover:bg-slate-100"
            />
          </button>
        </div>

        <Button
          variant="outline"
          size="small"
          className="px-4"
          onClick={() => changeDate(new Date())}
        >
          Hoje
        </Button>
      </div>
      {generateCalendar()}
    </>
  )
}