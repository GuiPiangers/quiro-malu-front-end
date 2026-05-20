'use client'

import { Input } from '@/components/input'
import { Role, listRoles } from '@/services/rbac/rbac'
import { Validate } from '@/services/api/Validate'
import { useQuery } from '@tanstack/react-query'

type RoleSelectProps = {
  value: string
  onChange(roleId: string): void
  disabled?: boolean
  error?: boolean
  defaultRoles?: Role[]
}

export default function RoleSelect({
  value,
  onChange,
  disabled,
  error,
  defaultRoles,
}: RoleSelectProps) {
  const { data: roles } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const result = await listRoles()
      if (Validate.isError(result)) throw new Error(result.message)
      return result
    },
    initialData: defaultRoles,
  })

  return (
    <Input.Select
      value={value}
      disabled={disabled || !roles?.length}
      error={error}
      onChange={(_, selected) => onChange((selected as string) ?? '')}
      slotProps={{ popper: { className: 'z-50' } }}
    >
      <Input.Option value="">Selecione uma função</Input.Option>
      {roles?.map((role) => (
        <Input.Option key={role.id} value={role.id}>
          {role.name}
        </Input.Option>
      ))}
    </Input.Select>
  )
}
