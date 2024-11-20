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
    onChange,
    ...props
  }: SelectProps<object | string, boolean> & inputVariantProps,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  const [services, setServices] = useState<ServiceResponse[]>()
  const [selectedService, setSelectedService] = useState<ServiceResponse>()

  useEffect(() => {
    clientService.list({}).then((data) => {
      if (Validate.isOk(data)) {
        setServices(data.services)
        setSelectedService(
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
      value={selectedService}
      onChange={(_, value) => {
        setSelectedService(value as ServiceResponse)
        onChange && onChange(_, value)
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
