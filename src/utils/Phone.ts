export default class Phone {
  private static _pattern = '(??) ????? ????'

  static format(valor: string): string {
    const nums = Phone.unformat(valor).split('')
    return nums
      .reduce((formatted: string, num: string) => {
        return formatted.replace('?', num)
      }, Phone._pattern)
      .split('?')[0]
      .trim()
      .replace(/[() ]$/, '')
  }

  static unformat(valor: string): string {
    return valor.replace(/[^0-9]+/g, '')
  }
}
