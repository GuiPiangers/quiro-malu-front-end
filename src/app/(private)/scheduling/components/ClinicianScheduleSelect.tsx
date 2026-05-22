'use client'

import { Input } from '@/components/input'
import { ClinicianListItem } from '@/services/clinicUsers/clinicUsers'
import { getInitials } from '@/utils/getInitials'
import { generateSearchParams } from '@/utils/generateSearchParams'
import { convertEntriesToObject } from '@/utils/convertEntriesToObject'
import { useRouter, useSearchParams } from 'next/navigation'
import { twMerge } from 'tailwind-merge'

type ClinicianScheduleSelectProps = {
  clinicians: ClinicianListItem[]
  selectedUserId: string
  date: string
}

function ClinicianOptionContent({ name }: { name: string }) {
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

export default function ClinicianScheduleSelect({
  clinicians,
  selectedUserId,
  date,
}: ClinicianScheduleSelectProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selected = clinicians.find((c) => c.id === selectedUserId)

  const updateUserId = (userId: string) => {
    const params = convertEntriesToObject(Array.from(searchParams.entries()))
    router.replace(
      generateSearchParams({
        ...params,
        date,
        userId,
      }),
    )
  }

  if (!clinicians.length) {
    return (
      <p className="text-sm text-slate-500">
        Nenhum clínico com agenda cadastrado.
      </p>
    )
  }

  return (
    <Input.Root className="min-w-0">
      <Input.Label>Profissional</Input.Label>
      <Input.Select
        value={selectedUserId}
        onChange={(_, value) => updateUserId(value as string)}
        slotProps={{ popper: { className: 'z-40' } }}
        renderValue={() =>
          selected ? (
            <ClinicianOptionContent name={selected.name} />
          ) : (
            <span className="text-slate-500">Selecione um profissional</span>
          )
        }
      >
        {clinicians.map((clinician) => (
          <Input.Option
            key={clinician.id}
            value={clinician.id}
            className={twMerge(
              'rounded-lg px-2 py-2',
              clinician.id === selectedUserId && 'bg-emerald-50',
            )}
          >
            <ClinicianOptionContent name={clinician.name} />
          </Input.Option>
        ))}
      </Input.Select>
    </Input.Root>
  )
}
