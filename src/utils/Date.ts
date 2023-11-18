export default class DateTime {
  static getIsoDate(date: Date | string) {
    const dateValue = typeof date === 'string' ? new Date(date) : date
    return dateValue.toISOString().substring(0, 10)
  }

  static getIsoDateTime(date: Date | string) {
    return `${DateTime.getIsoDate(date)}T${DateTime.getTime(date)}`
  }

  static getTime(date: Date | string) {
    const dateValue = typeof date === 'string' ? new Date(date) : date
    return dateValue.toTimeString().substring(0, 5)
  }

  static getLocaleDate(date: Date | string) {
    const dateValue = typeof date === 'string' ? new Date(date) : date

    return dateValue.toLocaleDateString()
  }

  static calcAge(date: Date | string) {
    const dateOfBirth = typeof date === 'string' ? new Date(date) : date
    const year = dateOfBirth.getFullYear()
    const month = dateOfBirth.getMonth()
    const day = dateOfBirth.getDate()

    const now = new Date()
    const nowYear = now.getFullYear()
    const nowMonth = now.getMonth()
    const nowDay = now.getDate()

    if (month > nowMonth) {
      return nowYear - year - 1
    }
    if (month === nowMonth && day > nowDay) {
      return nowYear - year - 1
    }
    return nowYear - year
  }
}
