export class Currency {
  static format(value: string) {
    return value
      .replace(/\D/g, '')
      .replace(/^0+/, '')
      .replace(/(\d)(\d{2})$/, '$1,$2')
      .replace(/(?=(\d{3})+(\D))\B/g, '.')
  }
}
