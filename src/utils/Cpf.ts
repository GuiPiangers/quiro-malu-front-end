import { validateRegex } from './validateRegex'

export default class Cpf {
  private static _pattern = '???.???.???-??'

  static format(valor: string): string {
    const nums = Cpf.unformat(valor).split('')
    return nums
      .reduce((formatted: string, num: string) => {
        return formatted.replace('?', num)
      }, Cpf._pattern)
      .split('?')[0]
      .replace(/[-.]$/, '')
  }

  static unformat(valor: string): string {
    return valor.replace(/[^0-9]+/g, '')
  }

  static validate(value: string): boolean {
    return (
      value.length > 0 &&
      validateRegex(value, /^[0-9]{3}.[0-9]{3}.[0-9]{3}-[0-9]{2}$/)
    )
  }
}
