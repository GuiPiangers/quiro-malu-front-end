'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import Button from '@/components/Button'
import { Input } from '@/components/input'
import useSnackbarContext from '@/hooks/useSnackbarContext'
import { Validate } from '@/services/api/Validate'
import {
  createMessageSendStrategy,
  updateMessageSendStrategy,
} from '@/services/message/sendList'
import { listPatient } from '@/services/patient/patient'
import { UserMinus, UserPlus } from 'lucide-react'

const KIND = 'send_selected_list' as const
const PAGE_LIMIT = 20
const MAX_SELECTED = 50

export type SelectedListPatientRow = {
  id: string
  name: string
  phone: string
}

export type SendSelectedListFormProps =
  | { mode: 'create' }
  | {
      mode: 'edit'
      strategyId: string
      defaultName: string
      initialSelected: SelectedListPatientRow[]
    }

function isEditProps(
  props: SendSelectedListFormProps,
): props is Extract<SendSelectedListFormProps, { mode: 'edit' }> {
  return props.mode === 'edit'
}

export default function SendSelectedListForm(props: SendSelectedListFormProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { handleMessage } = useSnackbarContext()
  const [name, setName] = useState(() =>
    isEditProps(props) ? props.defaultName : '',
  )
  const [selected, setSelected] = useState<SelectedListPatientRow[]>(() =>
    isEditProps(props) ? props.initialSelected : [],
  )
  const [nameError, setNameError] = useState<string | undefined>(undefined)
  const [submitting, setSubmitting] = useState(false)

  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    const t = window.setTimeout(
      () => setDebouncedSearch(searchInput.trim()),
      300,
    )
    return () => window.clearTimeout(t)
  }, [searchInput])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  const selectedIds = useMemo(
    () => new Set(selected.map((s) => s.id)),
    [selected],
  )

  const { data: patientPage, isPending } = useQuery({
    queryKey: [
      'patients',
      'sendSelectedListPicker',
      page,
      debouncedSearch,
      PAGE_LIMIT,
    ],
    queryFn: async () =>
      listPatient({
        page: String(page),
        limit: PAGE_LIMIT,
        search: { name: debouncedSearch },
      }),
  })

  const totalPatients = useMemo(() => {
    if (!patientPage || Validate.isError(patientPage)) return 0
    return patientPage.total ?? 0
  }, [patientPage])

  const totalPages = Math.max(1, Math.ceil(totalPatients / PAGE_LIMIT))

  const availableRows = useMemo(() => {
    if (!patientPage || Validate.isError(patientPage)) return []
    return patientPage.patients.filter(
      (p) => typeof p.id === 'string' && p.id !== '' && !selectedIds.has(p.id),
    )
  }, [patientPage, selectedIds])

  const addPatient = useCallback(
    (row: { id?: string; name: string; phone: string }) => {
      if (!row.id || selectedIds.has(row.id)) return
      if (selected.length >= MAX_SELECTED) {
        handleMessage({
          title: 'Limite atingido',
          description: `Você pode incluir no máximo ${MAX_SELECTED} pacientes nesta lista.`,
          type: 'error',
        })
        return
      }
      setSelected((prev) => [
        ...prev,
        { id: row.id as string, name: row.name, phone: row.phone },
      ])
    },
    [handleMessage, selected.length, selectedIds],
  )

  const removePatient = useCallback((id: string) => {
    setSelected((prev) => prev.filter((p) => p.id !== id))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setNameError(undefined)
    const n = name.trim()
    if (!n) {
      setNameError('Informe o nome da lista.')
      return
    }

    const patientIdList = selected.map((s) => s.id)

    setSubmitting(true)
    const res = isEditProps(props)
      ? await updateMessageSendStrategy(props.strategyId, {
          kind: KIND,
          name: n,
          params: { patientIdList },
        })
      : await createMessageSendStrategy({
          kind: KIND,
          name: n,
          params: { patientIdList },
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
    <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-6">
      <Input.Root className="max-w-xl">
        <Input.Label>Nome da lista</Input.Label>
        <Input.Field
          name="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            setNameError(undefined)
          }}
          placeholder="Ex.: Convite campanha X"
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

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex min-h-0 flex-col rounded-lg border border-slate-200 bg-white p-4">
          <h4 className="mb-3 text-sm font-semibold text-slate-800">
            Pacientes disponíveis
          </h4>
          <Input.Root className="mb-3">
            <Input.Label className="sr-only">Buscar por nome</Input.Label>
            <Input.Field
              placeholder="Buscar por nome…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              autoComplete="off"
              disabled={submitting}
            />
          </Input.Root>

          <div className="min-h-[200px] flex-1 space-y-1 overflow-y-auto">
            {isPending ? (
              <p className="text-sm text-slate-500">Carregando…</p>
            ) : Validate.isError(patientPage) ? (
              <p className="text-sm text-red-600">
                Não foi possível carregar os pacientes.
              </p>
            ) : availableRows.length === 0 ? (
              <p className="text-sm text-slate-500">
                Nenhum paciente encontrado nesta página.
              </p>
            ) : (
              availableRows.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-2 rounded-md border border-slate-100 bg-slate-50/80 px-3 py-2 text-sm"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-900">
                      {p.name}
                    </p>
                    <p className="truncate text-slate-600">{p.phone}</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="small"
                    color="green"
                    className="shrink-0 px-2"
                    disabled={
                      submitting || selected.length >= MAX_SELECTED || !p.id
                    }
                    onClick={() => addPatient(p)}
                    aria-label={`Incluir ${p.name}`}
                  >
                    <UserPlus className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>

          {totalPages > 1 ? (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
              <span>
                Página {page} de {totalPages} ({totalPatients} pacientes)
              </span>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="small"
                  disabled={page <= 1 || submitting}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Anterior
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="small"
                  disabled={page >= totalPages || submitting}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Próxima
                </Button>
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex min-h-0 flex-col rounded-lg border border-main/30 bg-purple-50/40 p-4">
          <h4 className="mb-1 text-sm font-semibold text-main">
            Pacientes selecionados ({selected.length}/{MAX_SELECTED})
          </h4>
          <div className="max-h-[min(420px,55vh)] flex-1 space-y-1 overflow-y-auto">
            {selected.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">
                Nenhum paciente selecionado.
              </p>
            ) : (
              selected.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-900">
                      {p.name}
                    </p>
                    <p className="truncate text-slate-600">{p.phone}</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="small"
                    color="red"
                    className="shrink-0 px-2"
                    disabled={submitting}
                    onClick={() => removePatient(p.id)}
                    aria-label={`Remover ${p.name}`}
                  >
                    <UserMinus className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="submit"
          color="green"
          variant="solid"
          disabled={submitting}
          className="self-start"
        >
          {submitting ? 'Salvando…' : submitLabel}
        </Button>
        {selected.length >= MAX_SELECTED ? (
          <span className="text-xs text-amber-700">
            Limite de {MAX_SELECTED} pacientes atingido.
          </span>
        ) : null}
      </div>
    </form>
  )
}
