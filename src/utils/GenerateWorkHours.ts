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
    const allTimes = new Map<string, null | T>()
    const newArray = [...this.workHours, ...data]
      .filter((value) => {
        return !data.some((scheduling) => {
          const startTime = DateTime.getTime(new Date(scheduling.date))
          const end = this._hasDurationProp(scheduling)
            ? new Date(scheduling.date)
            : new Date(scheduling.endDate)

          if (this._hasDurationProp(scheduling))
            end.setSeconds(scheduling.duration)
          const endTime = DateTime.getTime(end)

          return startTime <= value && value < endTime
        })
      })
      .sort()
    newArray.forEach((item) => {
      if (typeof item === 'string') allTimes.set(item, null)
      else allTimes.set(DateTime.getTime(item.date), item)
    })

    return Array.from(allTimes).sort()
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

  private configureBlockEventHours(event: endDateEvent, date: string) {
    const endDateWithoutHours = DateTime.getIsoDate(event.endDate)
    const startDateWithoutHours = DateTime.getIsoDate(event.date)

    const isNotSameDate = startDateWithoutHours !== endDateWithoutHours
    const tableEvent: endDateEvent & {
      realEndDate: string
      realStartDate: string
    } = { ...event, realStartDate: event.date, realEndDate: event.endDate }

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
