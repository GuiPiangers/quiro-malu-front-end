export default class Age {
  static discover(date: Date | string) {
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
