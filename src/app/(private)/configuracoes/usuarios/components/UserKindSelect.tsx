'use client'

import { Box } from '@/components/box/Box'
import { twMerge } from 'tailwind-merge'

export type UserKind = 'user' | 'clinician'

const USER_KIND_OPTIONS: Array<{
  value: UserKind
  title: string
  description: string
}> = [
  {
    value: 'user',
    title: 'Usuário',
    description: 'Usuário sem agenda ou serviços vinculados.',
  },
  {
    value: 'clinician',
    title: 'Clínico',
    description: 'Profissional com agenda e serviços vinculados.',
  },
]

type UserKindSelectProps = {
  value: UserKind
  onChange(kind: UserKind): void
  disabled?: boolean
  error?: boolean
}

export default function UserKindSelect({
  value,
  onChange,
  disabled,
  error,
}: UserKindSelectProps) {
  return (
    <div
      className="grid gap-3 sm:grid-cols-2"
      role="radiogroup"
      aria-label="Tipo de usuário"
    >
      {USER_KIND_OPTIONS.map((option) => {
        const selected = value === option.value

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={disabled}
            onClick={() => onChange(option.value)}
            className="text-left disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Box
              className={twMerge(
                'bg-white p-4 shadow-none transition-colors hover:border-slate-300 hover:bg-slate-50',
                selected ? 'border-main ring-1 ring-main' : 'border-slate-200',
                error && !selected && 'border-red-300',
              )}
            >
              <span className="block font-semibold text-main">
                {option.title}
              </span>
              <p className="mt-1 text-sm text-slate-600">
                {option.description}
              </p>
            </Box>
          </button>
        )
      })}
    </div>
  )
}
