'use client'

import { SelectProps } from '@mui/base'
import { ForwardedRef, forwardRef, useEffect, useState } from 'react'
import { inputVariantProps } from '../InputField'
import { Input } from '..'
import { Validate } from '@/services/api/Validate'
import { useQuery } from '@tanstack/react-query'
import { listCities } from '@/services/location/city'

export default forwardRef(function CitySelect(
  {
    uf = '',
    value,
    ...props
  }: SelectProps<object | string, boolean> & inputVariantProps & { uf: string },
  ref: ForwardedRef<HTMLButtonElement>,
) {
  const [selectedCity, setSelectedCity] = useState<string>()
  const { data } = useQuery({
    queryKey: ['listCities', { uf: uf || 'na' }],
    queryFn: async () => {
      const result = await listCities(uf)

      if (Validate.isOk(result)) {
        setSelectedCity(
          data?.find((dataValue) => {
            return dataValue === value
          }),
        )
        return result
      }

      return []
    },
  })

  useEffect(() => {
    const result = data?.find((dataValue) => {
      return dataValue === value
    })
    if (!value) return
    setSelectedCity(result)
  }, [data, value])

  return (
    <Input.Select
      ref={ref}
      {...props}
      value={selectedCity}
      slotProps={{
        popper: { className: 'z-40' },
      }}
    >
      {data &&
        data.map((city) => (
          <Input.Option key={city} value={city}>
            {city}
          </Input.Option>
        ))}
    </Input.Select>
  )
})
