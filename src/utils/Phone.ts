import { removeNotNumbers } from './removeNotNumbers'

export default class Phone {
  private static _pattern = '(??) ????? ????'
  private static _internationalPattern = '+?? (??) ????? ????'

  static format(value: string): string {
    const nums = Phone.unformat(value).split('')
    return nums
      .reduce((formatted: string, num: string) => {
        return formatted.replace('?', num)
      }, Phone._pattern)
      .split('?')[0]
      .trim()
      .replace(/[() ]$/, '')
  }

  static internationalFormat(value: string): string {
    const nums = Phone.unformat(value).split('')
    if (nums.length === 0) return ''
    return nums
      .reduce((formatted: string, num: string) => {
        return formatted.replace('?', num)
      }, Phone._internationalPattern)
      .split('?')[0]
      .trim()
      .replace(/[()+ ]+$/g, '')
  }

  static unformat(value: string): string {
    return value && removeNotNumbers(value)
  }
}
