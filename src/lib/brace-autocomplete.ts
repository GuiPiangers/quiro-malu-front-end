export function getActiveBraceQuery(
  text: string,
  cursor: number,
  openToken = '{{',
  closeToken = '}}',
): { start: number; query: string } | null {
  const before = text.slice(0, cursor)
  const lastOpen = before.lastIndexOf(openToken)
  if (lastOpen === -1) return null

  const afterOpenStart = lastOpen + openToken.length
  const closeLen = closeToken.length
  const sliceAfterOpen = text.slice(afterOpenStart, cursor)
  if (sliceAfterOpen.includes(closeToken)) return null

  const restFromOpen = text.slice(afterOpenStart)
  const relClose = restFromOpen.indexOf(closeToken)
  if (relClose !== -1) {
    const closeStart = afterOpenStart + relClose
    if (cursor < closeStart + closeLen) {
      return null
    }
  }

  return { start: lastOpen, query: sliceAfterOpen }
}

export function braceInnerValue(
  wrapped: string,
  openToken = '{{',
  closeToken = '}}',
): string {
  if (!wrapped.startsWith(openToken) || !wrapped.endsWith(closeToken)) {
    return wrapped
  }
  return wrapped.slice(openToken.length, wrapped.length - closeToken.length)
}

export type BraceAutocompleteOption = {
  value: string
  label: string
  description?: string
}

export function filterBraceOptions(
  options: BraceAutocompleteOption[],
  query: string,
  openToken = '{{',
  closeToken = '}}',
): BraceAutocompleteOption[] {
  const q = query.trim().toLowerCase()
  if (q === '') return options
  return options.filter((opt) => {
    const inner = braceInnerValue(
      opt.value,
      openToken,
      closeToken,
    ).toLowerCase()
    return inner.startsWith(q)
  })
}
