export class Currency {
  static format(value: string | number) {
    const stingValue =
      typeof value === 'number' ? String(value.toFixed(2)) : value

    return stingValue
      .replace(/\D/g, '')
      .replace(/^0+/, '')
      .replace(/(\d)(\d{2})$/, '$1,$2')
      .replace(/(?=(\d{3})+(\D))\B/g, '.')
  }
}
