'use client'

import CalendarItem from './CalendarItem'
import { RxCaretDown } from 'react-icons/rx'
import { useRouter, useSearchParams } from 'next/navigation'
import Button from '../Button'
import DateTime from '@/utils/Date'
import { CalendarProps } from './calendarTypes'
import { useCalendar } from '@/hooks/useCalendar'
import useWindowSize from '@/hooks/useWindowSize'
import { useEffect } from 'react'

export default function Calendar({ getAppointments }: CalendarProps) {
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  const router = useRouter()
  const changeDate = (date: Date) => {
    router.replace(`?date=${DateTime.getIsoDate(date)}`)
  }
  const selectedDate =
    useSearchParams().get('date') || DateTime.getIsoDate(new Date())
  const {
    appointments,
    isExpanded,
    toggleCalendarExpansion,
    setIsExpanded,
    date,
    daysInTheMonth,
    lastDaysOfLastMonth,
    daysInCurrentWeek,
    nextWeek,
    prevWeek,
    nextMonth,
    prevMonth,
    setDate,
  } = useCalendar({ getAppointments }, selectedDate)

  const { windowWidth } = useWindowSize()

  useEffect(() => {
    if (windowWidth > 768) {
      setIsExpanded(true)
    }
  }, [windowWidth])

  const generateMonthViewCalendar = () => {
    return (
      <>
        {lastDaysOfLastMonth().map((day) => (
          <CalendarItem
            key={day.getTime()}
            date={day}
            disable
            handleOnClick={() => changeDate(day)}
          />
        ))}
        {daysInTheMonth().map((day) => {
          const appointedDay = appointments.find((scheduling) => {
            return scheduling.date === DateTime.getIsoDate(day)
          })

          return (
            <CalendarItem
              key={day.getTime()}
              date={day}
              setDate={setDate}
              focusDate={date}
              focused={date.toLocaleDateString() === day.toLocaleDateString()}
              selected={selectedDate === DateTime.getIsoDate(day)}
              handleOnClick={() => changeDate(day)}
            >
              {appointedDay && (
                <div className="grid h-5 w-5 place-items-center rounded-full bg-purple-800 text-white">
                  {appointedDay.qtd}
                </div>
              )}
            </CalendarItem>
          )
        })}
      </>
    )
  }

  const generateWeekViewCalendar = () => {
    return (
      <>
        {daysInCurrentWeek().map(({ date: day, isDisabled }) => {
          const appointment = appointments.find(
            (a) => a.date === DateTime.getIsoDate(day),
          )
          return (
            <CalendarItem
              disable={isDisabled}
              key={day.getTime()}
              date={day}
              setDate={setDate}
              focusDate={date}
              focused={date.toLocaleDateString() === day.toLocaleDateString()}
              selected={selectedDate === DateTime.getIsoDate(day)}
              handleOnClick={() => changeDate(day)}
            >
              {appointment && (
                <div className="grid h-5 w-5 place-items-center rounded-full bg-purple-800 text-white">
                  {appointment.qtd}
                </div>
              )}
            </CalendarItem>
          )
        })}
      </>
    )
  }

  const generateCalendar = () => (
    <div className="grid grid-cols-7">
      {weekDays.map((weekDay) => (
        <div className="mb-1 text-center text-sm" key={weekDay}>
          {weekDay}
        </div>
      ))}
      {isExpanded ? generateMonthViewCalendar() : generateWeekViewCalendar()}
    </div>
  )

  return (
    <>
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <button onClick={isExpanded ? prevMonth : prevWeek}>
            <RxCaretDown
              size={24}
              className="rotate-90 cursor-pointer rounded text-main hover:bg-slate-100"
            />
          </button>

          <span className="text-lg font-semibold text-main">
            {date.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
          </span>

          <button onClick={isExpanded ? nextMonth : nextWeek}>
            <RxCaretDown
              size={24}
              className="-rotate-90 cursor-pointer rounded text-main hover:bg-slate-100"
            />
          </button>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="small"
            className="px-4"
            onClick={() => {
              changeDate(new Date())
              setDate(new Date())
            }}
          >
            Hoje
          </Button>
          <button
            onClick={toggleCalendarExpansion}
            className=" rounded border p-1 transition-colors hover:bg-slate-100 md:hidden"
          >
            {isExpanded ? (
              <RxCaretDown
                size={24}
                className="rotate-180 cursor-pointer rounded "
              />
            ) : (
              <RxCaretDown size={24} className="cursor-pointer rounded " />
            )}
          </button>
        </div>
      </div>
      {generateCalendar()}
    </>
  )
}
