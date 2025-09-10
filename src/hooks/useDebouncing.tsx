import { Dispatch, SetStateAction, useEffect, useState } from 'react'

export function useDebouncing({
  delay = 300,
  onDebounce,
}: {
  delay?: number
  onDebounce?({ value }: { value: string }): void
} = {}) {
  const [debouncedValue, setDebouncedValue] = useState('')
  const [value, setValue] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
      onDebounce?.({ value })
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return [debouncedValue, setValue, value] as [
    string,
    Dispatch<SetStateAction<string>>,
    string,
  ]
}
