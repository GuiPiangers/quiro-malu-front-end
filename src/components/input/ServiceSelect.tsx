'use client'

import { SelectProps } from '@mui/base'
import { ForwardedRef, forwardRef, useEffect } from 'react'
import { inputVariantProps } from './InputField'
import { Input } from '.'
import {
  ServiceResponse,
  listService,
} from '@/services/service/actions/service'
import { Validate } from '@/services/api/Validate'
import { useQuery } from '@tanstack/react-query'

export default forwardRef(function ServiceSelect(
  {
    defaultValue,
    onInitialize,
    ...props
  }: SelectProps<object | string, boolean> &
    inputVariantProps & {
      onInitialize?(value: ServiceResponse | undefined): void
    },
  ref: ForwardedRef<HTMLButtonElement>,
) {
  const { data } = useQuery({
    queryKey: ['listServices'],
    queryFn: async () => {
      const result = await listService({})

      if (Validate.isOk(result)) {
        return result
      }
    },
  })

  useEffect(() => {
    onInitialize &&
      data &&
      onInitialize(
        data.services.find((service) => service.name === defaultValue),
      )
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
        data.services.map((service) => (
          <Input.Option key={service.id} value={service}>
            {service.name}
          </Input.Option>
        ))}
    </Input.Select>
  )
})
