export const validateRegex = (value: string, pattern: RegExp) => {
  return pattern.test(value)
}
