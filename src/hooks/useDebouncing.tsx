import { Dispatch, SetStateAction, useEffect, useState } from 'react'

export function useDebouncing(delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState('')
  const [value, setValue] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return [debouncedValue, setValue] as [
    string,
    Dispatch<SetStateAction<string>>,
  ]
}
