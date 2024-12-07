import DateTime from './Date'

export type GenerateWorkHoursProps = {
  workSchedules: Array<{ start: string; end: string }>
  workTimeIncrement: number
}

export class GenerateWorkHours {
  readonly workSchedules: Array<{ start: string; end: string }>
  readonly workHours: Array<string>
  readonly workTimeIncrement: number

  constructor({
    workSchedules,
    workTimeIncrement,
  }: {
    workSchedules: Array<{ start: string; end: string }>
    workTimeIncrement: number
  }) {
    this.workSchedules = workSchedules
    this.workTimeIncrement = workTimeIncrement

    const times = new Set<string>()

    workSchedules.forEach((timeWork) => {
      const currentTime = this._convertTime(timeWork.start)
      const endTime = this._convertTime(timeWork.end)

      // eslint-disable-next-line no-unmodified-loop-condition
      while (currentTime <= endTime) {
        times.add(DateTime.getTime(currentTime))
        currentTime.setMinutes(currentTime.getMinutes() + workTimeIncrement)
      }
    })

    this.workHours = Array.from(times.values())
  }

  generate<T>(data: Array<{ date: string; duration: number } & T>) {
    const allTimes = new Map<string, null | T>()
    const newArray = [...this.workHours, ...data]
      .filter((value) => {
        return !data.some((scheduling) => {
          const startTime = DateTime.getTime(new Date(scheduling.date))
          const end = new Date(scheduling.date)
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
}
