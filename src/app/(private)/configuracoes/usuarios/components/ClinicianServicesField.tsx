'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { listService } from '@/services/service/Service'
import { Validate } from '@/services/api/Validate'
import { useQuery } from '@tanstack/react-query'

type ClinicianServicesFieldProps = {
  value: string[]
  onChange(serviceIds: string[]): void
  disabled?: boolean
  error?: string
}

export default function ClinicianServicesField({
  value,
  onChange,
  disabled,
  error,
}: ClinicianServicesFieldProps) {
  const { data } = useQuery({
    queryKey: ['listServices', { page: '1', search: '' }],
    queryFn: async () => {
      const result = await listService({ page: '1', search: '' })
      if (Validate.isError(result)) throw new Error(result.message)
      return result
    },
  })

  const toggle = (serviceId: string, checked: boolean) => {
    if (checked) {
      onChange([...value, serviceId])
      return
    }
    onChange(value.filter((id) => id !== serviceId))
  }

  if (!data?.services.length) {
    return (
      <p className="text-sm text-slate-500">
        Nenhum serviço cadastrado. Cadastre serviços antes de vincular a um
        clínico.
      </p>
    )
  }

  return (
    <div className="space-y-2">
      <ul className="max-h-48 space-y-2 overflow-y-auto">
        {data.services.map((service) => (
          <li
            key={service.id}
            className="flex items-center gap-3 rounded-md border border-slate-200 px-3 py-2"
          >
            <Checkbox
              id={`svc-${service.id}`}
              checked={value.includes(service.id!)}
              disabled={disabled || !service.id}
              onCheckedChange={(checked) =>
                service.id && toggle(service.id, checked === true)
              }
            />
            <label
              htmlFor={`svc-${service.id}`}
              className="flex-1 cursor-pointer text-sm font-medium text-slate-800"
            >
              {service.name}
            </label>
          </li>
        ))}
      </ul>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
