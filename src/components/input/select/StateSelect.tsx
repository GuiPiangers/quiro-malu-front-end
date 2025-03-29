'use client'

import { SelectProps } from '@mui/base'
import { ForwardedRef, forwardRef, useEffect } from 'react'
import { inputVariantProps } from '../InputField'
import { Input } from '..'
import { Validate } from '@/services/api/Validate'
import { useQuery } from '@tanstack/react-query'
import { listStates } from '@/services/location/location'

export default forwardRef(function StateSelect(
  {
    defaultValue,
    onInitialize,
    ...props
  }: SelectProps<object | string, boolean> &
    inputVariantProps & {
      onInitialize?(value: { name: string; uf: string } | undefined): void
    },
  ref: ForwardedRef<HTMLButtonElement>,
) {
  const { data } = useQuery({
    queryKey: ['listStates'],
    queryFn: async () => {
      const result = await listStates()

      if (Validate.isOk(result)) {
        return result
      }
    },
  })

  useEffect(() => {
    onInitialize &&
      data &&
      onInitialize(data.find((state) => state.name === defaultValue))
  }, [data, defaultValue])

  return (
    <Input.Select
      ref={ref}
      {...props}
      slotProps={{
        popper: { className: 'z-40' },
      }}
    >
      {data &&
        data.map((state) => (
          <Input.Option key={state.uf} value={state}>
            {state.name}
          </Input.Option>
        ))}
    </Input.Select>
  )
})
