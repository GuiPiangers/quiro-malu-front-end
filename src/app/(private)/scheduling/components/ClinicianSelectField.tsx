'use client'

import { Input } from '@/components/input'
import { ClinicianListItem } from '@/services/clinicUsers/clinicUsers'
import { getInitials } from '@/utils/getInitials'
import { twMerge } from 'tailwind-merge'

export function ClinicianOptionContent({ name }: { name: string }) {
  return (
    <span className="flex min-w-0 items-center gap-3">
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-main/10 text-xs font-semibold text-main"
        aria-hidden
      >
        {getInitials(name)}
      </span>
      <span className="truncate font-medium text-slate-800">{name}</span>
    </span>
  )
}

type ClinicianSelectFieldProps = {
  clinicians: ClinicianListItem[]
  value: string
  onChange(userId: string): void
  disabled?: boolean
  readOnly?: boolean
  error?: boolean
}

export default function ClinicianSelectField({
  clinicians,
  value,
  onChange,
  disabled,
  readOnly,
  error,
}: ClinicianSelectFieldProps) {
  const selected = clinicians.find((c) => c.id === value)

  if (!clinicians.length) {
    return (
      <p className="text-sm text-slate-500">
        Nenhum clínico disponível para agendamento.
      </p>
    )
  }

  if (readOnly && selected) {
    return (
      <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
        <ClinicianOptionContent name={selected.name} />
      </div>
    )
  }

  return (
    <Input.Select
      value={value}
      disabled={disabled}
      error={error}
      onChange={(_, selected) => onChange((selected as string) ?? '')}
      slotProps={{ popper: { className: 'z-50' } }}
      renderValue={() =>
        selected ? (
          <ClinicianOptionContent name={selected.name} />
        ) : (
          <span className="text-slate-500">Selecione o profissional</span>
        )
      }
    >
      {clinicians.map((clinician) => (
        <Input.Option
          key={clinician.id}
          value={clinician.id}
          className={twMerge(
            'rounded-lg px-2 py-2',
            clinician.id === value && 'bg-emerald-50',
          )}
        >
          <ClinicianOptionContent name={clinician.name} />
        </Input.Option>
      ))}
    </Input.Select>
  )
}
