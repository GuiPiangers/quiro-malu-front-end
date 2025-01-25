export function generateSearchParams(objectParams: Record<string, string>) {
  function convertEntriesInString(entries: [string, string][]) {
    return entries.reduce((acc, entry, index) => {
      if (index === 0) return `${acc}${entry[0]}=${entry[1]}`
      return `${acc}&${entry[0]}=${entry[1]}`
    }, '?')
  }

  const searchParams = convertEntriesInString(Object.entries(objectParams))

  return searchParams
}
