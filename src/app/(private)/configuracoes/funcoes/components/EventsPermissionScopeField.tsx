'use client'

import { Input } from '@/components/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Validate } from '@/services/api/Validate'
import { listClinicians } from '@/services/user/user'
import { PermissionScope } from '@/types/permissions'
import { ClinicianOptionContent } from '@/app/(private)/scheduling/components/ClinicianSelectField'
import { useQuery } from '@tanstack/react-query'
import {
  EventsScopeChoice,
  listUserIdsFromScope,
  permissionScopeFromChoice,
  scopeChoiceFromPermission,
} from '../permissionScope'

const SCOPE_OPTIONS: { value: EventsScopeChoice; label: string }[] = [
  { value: 'all', label: 'Todos os profissionais' },
  { value: 'own', label: 'Apenas a própria agenda' },
  { value: 'list', label: 'Profissionais específicos' },
]

type EventsPermissionScopeFieldProps = {
  value: PermissionScope | null
  onChange(scope: PermissionScope | null): void
  disabled?: boolean
  error?: string
}

export default function EventsPermissionScopeField({
  value,
  onChange,
  disabled,
  error,
}: EventsPermissionScopeFieldProps) {
  const choice = scopeChoiceFromPermission(value)
  const selectedUserIds = listUserIdsFromScope(value)

  const { data: clinicians } = useQuery({
    queryKey: ['clinicians'],
    queryFn: async () => {
      const result = await listClinicians()
      if (Validate.isError(result)) throw new Error(result.message)
      return result
    },
  })

  const updateChoice = (nextChoice: EventsScopeChoice) => {
    onChange(
      permissionScopeFromChoice(
        nextChoice,
        nextChoice === 'list' ? selectedUserIds : [],
      ),
    )
  }

  const toggleClinician = (userId: string, checked: boolean) => {
    const nextUserIds = checked
      ? [...selectedUserIds, userId]
      : selectedUserIds.filter((id) => id !== userId)

    onChange(permissionScopeFromChoice('list', nextUserIds))
  }

  return (
    <div className="ml-7 mt-2 space-y-3 border-l border-slate-200 pl-3">
      <Input.Root>
        <Input.Label>Escopo da agenda</Input.Label>
        <Input.Select
          value={choice}
          disabled={disabled}
          error={!!error}
          slotProps={{ popper: { className: 'z-50' } }}
          onChange={(_, selected) =>
            updateChoice((selected as EventsScopeChoice) ?? 'all')
          }
        >
          {SCOPE_OPTIONS.map((option) => (
            <Input.Option key={option.value} value={option.value}>
              {option.label}
            </Input.Option>
          ))}
        </Input.Select>
        {error && <Input.Message error>{error}</Input.Message>}
      </Input.Root>

      {choice === 'list' && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-600">
            Selecione os profissionais
          </p>
          {!clinicians?.length ? (
            <p className="text-xs text-slate-500">
              Nenhum clínico disponível para vincular ao escopo.
            </p>
          ) : (
            <ul className="max-h-40 space-y-2 overflow-y-auto rounded-md border border-slate-200 p-2">
              {clinicians.map((clinician) => (
                <li
                  key={clinician.id}
                  className="flex items-center gap-3 rounded-md px-2 py-1.5 hover:bg-slate-50"
                >
                  <Checkbox
                    id={`scope-${clinician.id}`}
                    checked={selectedUserIds.includes(clinician.id)}
                    disabled={disabled}
                    onCheckedChange={(checked) =>
                      toggleClinician(clinician.id, checked === true)
                    }
                  />
                  <label
                    htmlFor={`scope-${clinician.id}`}
                    className="flex-1 cursor-pointer"
                  >
                    <ClinicianOptionContent name={clinician.name} />
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
