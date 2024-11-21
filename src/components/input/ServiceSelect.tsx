import { SelectProps } from '@mui/base'
import { ForwardedRef, forwardRef, useEffect, useState } from 'react'
import { inputVariantProps } from './InputField'
import { Input } from '.'
import { ServiceResponse } from '@/services/service/Service'
import { Validate } from '@/services/api/Validate'
import { clientService } from '@/services/service/clientService'
import { service } from '@/services/service/serverService'

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
  const [services, setServices] = useState<ServiceResponse[]>()

  useEffect(() => {
    clientService.list({}).then((data) => {
      if (Validate.isOk(data)) {
        setServices(data.services)
        onInitialize &&
          onInitialize(
            data.services.find((service) => service.name === defaultValue),
          )
      }
    })
  }, [])

  return (
    <Input.Select
      ref={ref}
      {...props}
      slotProps={{
        popper: { className: 'z-40' },
      }}
    >
      {services &&
        services.map((service) => (
          <Input.Option key={service.id} value={service}>
            {service.name}
          </Input.Option>
        ))}
    </Input.Select>
  )
})
