import { removeNotNumbers } from './removeNotNumbers'
import { validateRegex } from './validateRegex'

export default class Cep {
  private static _pattern = '?????-???'

  static format(value: string): string {
    const nums = Cep.unformat(value).split('')
    return nums
      .reduce((formatted: string, num: string) => {
        return formatted.replace('?', num)
      }, Cep._pattern)
      .split('?')[0]
      .replace(/[-]$/, '')
  }

  static unformat(value: string): string {
    return removeNotNumbers(value)
  }

  static validate(value: string): boolean {
    return value.length > 0 && validateRegex(value, /^[0-9]{5}-[0-9]{3}$/)
  }
}
