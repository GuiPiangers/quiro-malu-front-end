// useCalendar.tsx
import { useState, useEffect, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Validate } from '@/services/api/Validate'
import {
  appointments,
  CalendarProps,
} from '@/components/calendar/calendarTypes'
import { getQtdSchedulesByDay } from '@/services/scheduling/scheduling'
import { schedulesQtdQueryKey } from '@/services/scheduling/schedulingQueryKeys'
import useWindowSize from './useWindowSize'

export function useCalendar(
  { getAppointments, schedulesQtdUserId }: CalendarProps,
  selectedDate: string,
) {
  const [date, setDate] = useState(new Date())
  const [legacyAppointments, setLegacyAppointments] = useState<appointments[]>(
    [],
  )
  const { windowWidth } = useWindowSize()
  const [isExpanded, setIsExpanded] = useState(windowWidth > 768)
  const toggleCalendarExpansion = () => setIsExpanded((prev) => !prev)

  const month = date.getMonth()
  const year = date.getFullYear()
  const monthNumber = month + 1

  const { data: qtdAppointments = [] } = useQuery({
    queryKey: schedulesQtdQueryKey.month(
      schedulesQtdUserId ?? '',
      monthNumber,
      year,
    ),
    queryFn: async () => {
      const response = await getQtdSchedulesByDay({
        userId: schedulesQtdUserId!,
        month: monthNumber,
        year,
      })
      return Validate.isOk(response) ? response : []
    },
    enabled: !!schedulesQtdUserId,
  })

  const appointments = schedulesQtdUserId ? qtdAppointments : legacyAppointments

  const nextMonth = () =>
    setDate(new Date(date.getFullYear(), date.getMonth() + 1))

  const prevMonth = () =>
    setDate(new Date(date.getFullYear(), date.getMonth() - 1))

  useEffect(() => {
    if (schedulesQtdUserId || !getAppointments) return

    const fetchAppointments = async () => {
      const response = await getAppointments({ month: monthNumber, year })
      if (response && Validate.isOk(response)) setLegacyAppointments(response)
    }

    fetchAppointments()
  }, [getAppointments, monthNumber, year, schedulesQtdUserId])

  useEffect(() => {
    const parsedDate = new Date(
      +selectedDate.substring(0, 4),
      +selectedDate.substring(5, 7) - 1,
      +selectedDate.substring(8, 10),
    )
    setDate(new Date(parsedDate))
  }, [selectedDate])

  const daysInCurrentWeek = useCallback(() => {
    const startOfWeek = new Date(date)
    startOfWeek.setDate(date.getDate() - date.getDay())

    const weekDays = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      weekDays.push({
        date: day,
        isDisabled: day.getMonth() !== date.getMonth(), // Desativa dias fora do mês selecionado
      })
    }
    return weekDays
  }, [date])

  const nextWeek = () => {
    const next = new Date(date)
    next.setDate(date.getDate() + 7)
    setDate(next)
  }

  const prevWeek = () => {
    const prev = new Date(date)
    prev.setDate(date.getDate() - 7)
    setDate(prev)
  }

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

  return {
    isExpanded,
    toggleCalendarExpansion,
    setIsExpanded,
    date,
    setDate,
    appointments,
    nextMonth,
    prevMonth,
    daysInTheMonth,
    lastDaysOfLastMonth,
    daysInCurrentWeek,
    prevWeek,
    nextWeek,
  }
}
