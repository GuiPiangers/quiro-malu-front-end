'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import Button from '@/components/Button'
import { Input } from '@/components/input'
import useSnackbarContext from '@/hooks/useSnackbarContext'
import { Validate } from '@/services/api/Validate'
import {
  createMessageSendStrategy,
  updateMessageSendStrategy,
} from '@/services/message/sendList'

export type SendMostRecentPatientsFormProps =
  | {
      mode: 'create'
      kind: string
    }
  | {
      mode: 'edit'
      strategyId: string
      kind: string
      defaultName: string
      defaultAmount: string
    }

function isEditProps(
  props: SendMostRecentPatientsFormProps,
): props is Extract<SendMostRecentPatientsFormProps, { mode: 'edit' }> {
  return props.mode === 'edit'
}

export default function SendMostRecentPatientsForm(
  props: SendMostRecentPatientsFormProps,
) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { handleMessage } = useSnackbarContext()
  const [name, setName] = useState(() =>
    isEditProps(props) ? props.defaultName : '',
  )
  const [amount, setAmount] = useState(() =>
    isEditProps(props) ? props.defaultAmount : '',
  )
  const [nameError, setNameError] = useState<string | undefined>(undefined)
  const [amountError, setAmountError] = useState<string | undefined>(undefined)
  const [submitting, setSubmitting] = useState(false)

  function clearFieldErrors() {
    setNameError(undefined)
    setAmountError(undefined)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    clearFieldErrors()
    const n = name.trim()
    const a = Number(amount)
    let hasClientError = false
    if (!n) {
      setNameError('Informe o nome da lista.')
      hasClientError = true
    }
    if (!Number.isFinite(a) || a < 0) {
      setAmountError('Informe uma quantidade válida (número ≥ 0).')
      hasClientError = true
    }
    if (hasClientError) return

    setSubmitting(true)
    const res = isEditProps(props)
      ? await updateMessageSendStrategy(props.strategyId, {
          kind: props.kind,
          name: n,
          params: { amount: a },
        })
      : await createMessageSendStrategy({
          name: n,
          amount: a,
          kind: props.kind,
        })
    setSubmitting(false)
    if (Validate.isError(res)) {
      handleMessage({
        title: 'Erro!',
        description: res.message,
        type: 'error',
      })
      return
    }

    handleMessage({
      title:
        props.mode === 'edit'
          ? 'Lista de envio atualizada com sucesso!'
          : 'Lista de envio criada com sucesso!',
      type: 'success',
    })
    await queryClient.invalidateQueries({ queryKey: ['messageSendStrategies'] })
    router.push('/lista-envio')
    router.refresh()
  }

  const submitLabel =
    props.mode === 'edit' ? 'Salvar alterações' : 'Salvar lista'

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
        <Input.Root className="min-w-0 flex-1 sm:min-w-[12rem]">
          <Input.Label>Nome da lista</Input.Label>
          <Input.Field
            name="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setNameError(undefined)
            }}
            placeholder="Ex.: Últimos atendimentos"
            autoComplete="off"
            disabled={submitting}
            error={!!nameError}
          />
          {nameError ? (
            <Input.Message error role="alert">
              {nameError}
            </Input.Message>
          ) : null}
        </Input.Root>
        <div className="w-full min-w-0 shrink-0 sm:w-44">
          <Input.Root className="max-w-full">
            <Input.Label>Quantidade de pacientes</Input.Label>
            <Input.Field
              name="amount"
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value)
                setAmountError(undefined)
              }}
              placeholder="0"
              disabled={submitting}
              error={!!amountError}
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
            {amountError ? (
              <Input.Message error role="alert">
                {amountError}
              </Input.Message>
            ) : null}
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
        {submitting ? 'Salvando…' : submitLabel}
      </Button>
    </form>
  )
}
