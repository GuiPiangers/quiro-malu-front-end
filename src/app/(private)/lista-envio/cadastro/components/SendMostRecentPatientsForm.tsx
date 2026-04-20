'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import Button from '@/components/Button'
import { Input } from '@/components/input'
import { Validate } from '@/services/api/Validate'
import { createMessageSendStrategy } from '@/services/message/sendList'

export default function SendMostRecentPatientsForm() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitError(null)
    const n = name.trim()
    const a = Number(amount)
    if (!n) {
      setSubmitError('Informe o nome da lista.')
      return
    }
    if (!Number.isFinite(a) || a < 0) {
      setSubmitError('Informe uma quantidade válida (número ≥ 0).')
      return
    }
    setSubmitting(true)
    const res = await createMessageSendStrategy({
      name: n,
      amount: a,
      kind: 'send_most_recent_patients',
    })
    setSubmitting(false)
    if (Validate.isError(res)) {
      setSubmitError(res.message)
      return
    }
    await queryClient.invalidateQueries({ queryKey: ['messageSendStrategies'] })
    router.push('/lista-envio')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
        <Input.Root className="min-w-0 flex-1 sm:min-w-[12rem]">
          <Input.Label>Nome da lista</Input.Label>
          <Input.Field
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex.: Últimos atendimentos"
            autoComplete="off"
            disabled={submitting}
          />
        </Input.Root>
        <div className="w-full min-w-0 shrink-0 sm:w-44">
          <Input.Root className="max-w-full">
            <Input.Label>Quantidade de pacientes</Input.Label>
            <Input.Field
              name="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              disabled={submitting}
              slotProps={{
                root: {
                  className: 'w-full min-w-0 max-w-full overflow-hidden',
                },
                input: {
                  min: 0,
                  step: 1,
                  className: 'min-w-0 max-w-full !flex-grow-0 basis-full',
                },
              }}
            />
          </Input.Root>
        </div>
      </div>
      <Button
        type="submit"
        color="green"
        variant="solid"
        disabled={submitting}
        className="self-start"
      >
        {submitting ? 'Salvando…' : 'Salvar lista'}
      </Button>
      {submitError ? (
        <Input.Message error role="alert">
          {submitError}
        </Input.Message>
      ) : null}
    </form>
  )
}
