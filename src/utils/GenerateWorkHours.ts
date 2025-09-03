import DateTime from './Date'

type workSchedules = Array<{
  start: string // pattern HH:mm
  end: string // pattern HH:mm
}>

export type GenerateWorkHoursProps = {
  workSchedules: workSchedules
  workTimeIncrementInMinutes: number
}

type durationEvent = { date: string; duration: number }
type endDateEvent = { date: string; endDate: string }

export class GenerateWorkHours {
  readonly workSchedules: workSchedules

  readonly workHours: Array<string>
  readonly workTimeIncrementInMinutes: number

  constructor({
    workSchedules,
    workTimeIncrementInMinutes,
  }: GenerateWorkHoursProps) {
    this.workSchedules = workSchedules
    this.workTimeIncrementInMinutes = workTimeIncrementInMinutes

    const times = new Set<string>()

    workSchedules.forEach((timeWork) => {
      const currentTime = this._convertTime(timeWork.start)
      const endTime = this._convertTime(timeWork.end)

      // eslint-disable-next-line no-unmodified-loop-condition
      while (currentTime <= endTime) {
        times.add(DateTime.getTime(currentTime))
        currentTime.setMinutes(
          currentTime.getMinutes() + workTimeIncrementInMinutes,
        )
      }
    })

    this.workHours = Array.from(times.values())
  }

  generate<T>(
    data: Array<(durationEvent | endDateEvent) & T>,
    date?: string, // pattern yyyy-MM-dd
  ) {
    const allTimes = new Map<
      string,
      null | ((durationEvent | endDateEvent) & T)
    >()
    const newArray = [...this.workHours, ...data].filter((value) => {
      return !data
        .map((event) => {
          const startDate = DateTime.getIsoDateTime(new Date(event.date))
          const end = this._hasDurationProp(event)
            ? new Date(event.date)
            : new Date(event.endDate)

          if (this._hasDurationProp(event)) end.setSeconds(event.duration)
          const endDate = DateTime.getIsoDateTime(end)

          return this._configureBlockHours(
            {
              date: startDate,
              endDate,
            },
            date || DateTime.getIsoDateTime(new Date()),
          )
        })
        .some((event) => {
          const startTime = DateTime.getTime(new Date(event.date))
          const endTime = DateTime.getTime(event.endDate)
          return startTime <= value && value < endTime
        })
    })
    newArray.forEach((item) => {
      if (typeof item === 'string') allTimes.set(item, null)
      else allTimes.set(DateTime.getTime(item.date), item)
    })

    return Array.from(allTimes).sort((a, b) => {
      const comparisonDate = date || DateTime.getIsoDate(new Date())

      const dateA = a[1]?.date
        ? new Date(a[1].date)
        : new Date(`${comparisonDate}T${a[0]}`)

      const dateB = b[1]?.date
        ? new Date(b[1].date)
        : new Date(`${comparisonDate}T${b[0]}`)

      return dateA.getTime() - dateB.getTime()
    })
  }

  private _convertTime(time = '00:00') {
    const date = new Date()
    date.setHours(+time.substring(0, 2))
    date.setMinutes(+time.substring(3, 5))
    return date
  }

  private _hasDurationProp<T>(
    data: (durationEvent | endDateEvent) & T,
  ): data is durationEvent & T {
    return Object.hasOwn(data, 'duration')
  }

  private _configureBlockHours(event: endDateEvent, date: string) {
    const endDateWithoutHours = DateTime.getIsoDate(event.endDate)
    const startDateWithoutHours = DateTime.getIsoDate(event.date)

    const isNotSameDate = startDateWithoutHours !== endDateWithoutHours
    const tableEvent: endDateEvent = { ...event }

    if (isNotSameDate) {
      if (endDateWithoutHours !== date)
        tableEvent.endDate = `${endDateWithoutHours}T23:59`

      if (startDateWithoutHours !== date)
        tableEvent.date = `${endDateWithoutHours}T00:00`

      return tableEvent
    }

    return event
  }
}
