export function convertEntriesToObject(entries: [string, string][]) {
  return entries.reduce(
    (acc, entry) => {
      const returnObject = { ...acc }
      returnObject[entry[0]] = entry[1]
      return returnObject
    },
    {} as Record<string, string>,
  )
}
