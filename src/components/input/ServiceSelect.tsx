import { SelectProps } from '@mui/base'
import { ForwardedRef, forwardRef, useEffect, useState } from 'react'
import { inputVariantProps } from './InputField'
import { Input } from '.'
import { ServiceResponse } from '@/services/service/Service'
import { Validate } from '@/services/api/Validate'
import { clientService } from '@/services/service/clientService'

export default forwardRef(function ServiceSelect(
  props: SelectProps<object, boolean> & inputVariantProps,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  const [services, setServices] = useState<ServiceResponse[]>()

  useEffect(() => {
    clientService
      .list({ page: '1' })
      .then((data) => Validate.isOk(data) && setServices(data.services))
  }, [])

  return (
    <>
      <Input.Label>Serviço</Input.Label>
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
    </>
  )
})
