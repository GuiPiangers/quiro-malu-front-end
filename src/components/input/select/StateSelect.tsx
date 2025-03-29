'use client'

import { SelectProps } from '@mui/base'
import { ForwardedRef, forwardRef } from 'react'
import { inputVariantProps } from '../InputField'
import { Input } from '..'
import { Validate } from '@/services/api/Validate'
import { listStates } from '@/services/location/state'

export default forwardRef(function StateSelect(
  { ...props }: SelectProps<object | string, boolean> & inputVariantProps,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  const states = listStates()
  const data = Validate.isOk(states) ? states : undefined

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
          <Input.Option key={state} value={state}>
            {state}
          </Input.Option>
        ))}
    </Input.Select>
  )
})
