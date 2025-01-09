export default class DateTime {
  static getIsoDate(date: Date | string) {
    const dateValue = typeof date === 'string' ? new Date(date) : date

    const year = dateValue.getFullYear()
    const month = (dateValue.getMonth() + 1).toString().padStart(2, '0')
    const day = dateValue.getDate().toString().padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  static getTime(date: Date | string) {
    const dateValue = typeof date === 'string' ? new Date(date) : date
    const hours = dateValue.getHours().toString().padStart(2, '0')
    const minutes = dateValue.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  }

  static getIsoDateTime(date: Date | string) {
    return `${DateTime.getIsoDate(date)}T${DateTime.getTime(date)}`
  }

  static getLocaleDate(date: Date | string) {
    const dateValue = typeof date === 'string' ? new Date(date) : date

    return DateTime.getIsoDate(dateValue).replace(
      /(\d{4})-(\d{2})-(\d{2})/,
      '$3/$2/$1',
    )
  }

  static validateDate(date: string) {
    const datePattern = /^(\d{4})-(\d{2})-(\d{2})/
    return datePattern.test(date)
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
