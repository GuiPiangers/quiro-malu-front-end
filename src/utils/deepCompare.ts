/* eslint-disable @typescript-eslint/no-explicit-any */
const typeOf = (input: any) => {
  const rawObject = Object.prototype.toString.call(input).toLowerCase()
  const typeOfRegex = /\[object (.*)]/g
  const type = (typeOfRegex.exec(rawObject) as RegExpExecArray)[1]
  return type
}

export const deepCompare = (source: any, target: any): boolean => {
  if (typeOf(source) !== typeOf(target)) {
    return false
  }

  if (typeOf(source) === 'array') {
    if (source.length !== target.length) {
      return false
    }
    return source.every((el: any, index: string | number) =>
      deepCompare(el, target[index]),
    )
  } else if (typeOf(source) === 'object') {
    if (Object.keys(source).length !== Object.keys(target).length) {
      return false
    }
    return Object.keys(source).every((key) =>
      deepCompare(source[key], target[key]),
    )
  } else if (typeOf(source) === 'date') {
    return source.getTime() === target.getTime()
  }

  return source === target
}
