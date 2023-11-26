export class Time {
  readonly hours: number
  readonly minutes: number

  constructor(sec?: number) {
    this.hours = sec ? Math.floor(sec / (60 * 60)) : 0
    this.minutes = sec ? (sec % (60 * 60)) / 60 : 0
  }

  getHoursAndMinutes() {
    if (this.hours <= 0 && this.minutes <= 0) return '-'
    if (this.hours <= 0 && this.minutes > 0) return `${this.minutes}min`
    if (this.hours > 0 && this.minutes <= 0) return `${this.hours}h`

    return `${this.hours}h ${this.minutes}min`
  }

  static hoursAndMinutesToSec({
    hours,
    minutes,
  }: {
    hours: number
    minutes: number
  }) {
    return hours * 60 * 60 + minutes * 60
  }
}
