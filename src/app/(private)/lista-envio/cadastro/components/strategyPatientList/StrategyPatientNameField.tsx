'use client'

import { Input } from '@/components/input'

type StrategyPatientNameFieldProps = {
  name: string
  onChange: (value: string) => void
  error?: string
  placeholder: string
  disabled?: boolean
}

export default function StrategyPatientNameField({
  name,
  onChange,
  error,
  placeholder,
  disabled,
}: StrategyPatientNameFieldProps) {
  return (
    <Input.Root className="max-w-xl">
      <Input.Label>Nome da lista</Input.Label>
      <Input.Field
        name="name"
        value={name}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        disabled={disabled}
        error={!!error}
      />
      {error ? (
        <Input.Message error role="alert">
          {error}
        </Input.Message>
      ) : null}
    </Input.Root>
  )
}
