import DateTime from './Date'

export class GenerateWorkHours {
  readonly workSchedules: Array<{ start: string; end: string }>
  readonly workHours: Array<string>
  readonly schedulingDuration: number

  constructor({
    workSchedules,
    schedulingDuration,
  }: {
    workSchedules: Array<{ start: string; end: string }>
    schedulingDuration: number
  }) {
    this.workSchedules = workSchedules
    this.schedulingDuration = schedulingDuration

    const times = new Set<string>()

    workSchedules.forEach((timeWork) => {
      const currentTime = this._convertTime(timeWork.start)
      const endTime = this._convertTime(timeWork.end)

      // eslint-disable-next-line no-unmodified-loop-condition
      while (currentTime <= endTime) {
        times.add(DateTime.getTime(currentTime))
        currentTime.setMinutes(currentTime.getMinutes() + schedulingDuration)
      }
    })

    this.workHours = Array.from(times.values())
  }

  generate(
    data: Array<{ date: string; duration: number; [key: string]: any }>,
  ) {
    const allTimes = new Map<string, string | object>()

    this.workHours.forEach((hour) => {
      data.forEach((value) => {
        const startTime = DateTime.getTime(new Date(value.date))
        const end = new Date(value.date)
        end.setSeconds(value.duration)
        const endTime = DateTime.getTime(end)

        // console.log(
        //   hour,
        //   startTime,
        //   endTime,
        //   startTime <= hour && hour < endTime,
        // )

        if (this.workHours.some((v) => startTime <= v && v < endTime)) {
          if (!allTimes.has(value.date)) console.log(true)
          allTimes.set(DateTime.getTime(value.date), value)
        } else {
          if (!allTimes.has(hour)) allTimes.set(hour, { date: hour })
        }
      })
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
