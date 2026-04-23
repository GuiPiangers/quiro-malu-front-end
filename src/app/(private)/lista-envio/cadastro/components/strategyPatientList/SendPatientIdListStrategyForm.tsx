'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import Button from '@/components/Button'
import useSnackbarContext from '@/hooks/useSnackbarContext'
import { Validate } from '@/services/api/Validate'
import {
  createMessageSendStrategy,
  updateMessageSendStrategy,
} from '@/services/message/sendList'
import type { ListedMessageSendStrategyPatientListParamKinds } from '@/services/message/sendListTypes'
import { listPatient } from '@/services/patient/patient'
import StrategyPatientNameField from './StrategyPatientNameField'
import StrategyPatientPickerPanel from './StrategyPatientPickerPanel'
import StrategyPatientSelectedPanel from './StrategyPatientSelectedPanel'
import {
  STRATEGY_PATIENT_LIST_MAX_SELECTED,
  STRATEGY_PATIENT_LIST_PAGE_LIMIT,
  type StrategyPatientListRow,
} from './types'

export type PatientListStrategyFormCopy = {
  hintBelowName?: string
  namePlaceholder: string
  pickerTitle: string
  selectedTitle: string
  selectedSubtitle?: string
  emptySelectedMessage: string
  queryKeyPrefix: string
}

export type SendPatientIdListStrategyFormProps = {
  kind: ListedMessageSendStrategyPatientListParamKinds
  copy: PatientListStrategyFormCopy
} & (
  | { mode: 'create' }
  | {
      mode: 'edit'
      strategyId: string
      defaultName: string
      initialSelected: StrategyPatientListRow[]
    }
)

function isEditProps(
  props: SendPatientIdListStrategyFormProps,
): props is Extract<SendPatientIdListStrategyFormProps, { mode: 'edit' }> {
  return props.mode === 'edit'
}

export default function SendPatientIdListStrategyForm(
  props: SendPatientIdListStrategyFormProps,
) {
  const { kind, copy } = props
  const router = useRouter()
  const queryClient = useQueryClient()
  const { handleMessage } = useSnackbarContext()
  const [name, setName] = useState(() =>
    isEditProps(props) ? props.defaultName : '',
  )
  const [selected, setSelected] = useState<StrategyPatientListRow[]>(() =>
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
      copy.queryKeyPrefix,
      page,
      debouncedSearch,
      STRATEGY_PATIENT_LIST_PAGE_LIMIT,
    ],
    queryFn: async () =>
      listPatient({
        page: String(page),
        limit: STRATEGY_PATIENT_LIST_PAGE_LIMIT,
        search: { name: debouncedSearch },
      }),
  })

  const patientPageIsError = Boolean(
    patientPage && Validate.isError(patientPage),
  )

  const okPatientPage = useMemo(() => {
    if (!patientPage || Validate.isError(patientPage)) return undefined
    return patientPage
  }, [patientPage])

  const totalPatients = okPatientPage?.total ?? 0
  const totalPages = Math.max(
    1,
    Math.ceil(totalPatients / STRATEGY_PATIENT_LIST_PAGE_LIMIT),
  )

  const availableRows = useMemo(() => {
    if (!okPatientPage) return []
    return okPatientPage.patients.filter(
      (p) => typeof p.id === 'string' && p.id !== '' && !selectedIds.has(p.id),
    )
  }, [okPatientPage, selectedIds])

  const addPatient = useCallback(
    (row: { id?: string; name: string; phone: string }) => {
      if (!row.id || selectedIds.has(row.id)) return
      if (selected.length >= STRATEGY_PATIENT_LIST_MAX_SELECTED) {
        handleMessage({
          title: 'Limite atingido',
          description: `Você pode incluir no máximo ${STRATEGY_PATIENT_LIST_MAX_SELECTED} pacientes nesta lista.`,
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
          kind,
          name: n,
          params: { patientIdList },
        })
      : await createMessageSendStrategy({
          kind,
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
      <StrategyPatientNameField
        name={name}
        onChange={(v) => {
          setName(v)
          setNameError(undefined)
        }}
        error={nameError}
        placeholder={copy.namePlaceholder}
        disabled={submitting}
      />

      {copy.hintBelowName ? (
        <p className="text-xs text-slate-500">{copy.hintBelowName}</p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <StrategyPatientPickerPanel
          title={copy.pickerTitle}
          searchInput={searchInput}
          onSearchChange={setSearchInput}
          isPending={isPending}
          patientPage={okPatientPage}
          patientPageIsError={patientPageIsError}
          availableRows={availableRows}
          page={page}
          totalPages={totalPages}
          totalPatients={totalPatients}
          onPrevPage={() => setPage((p) => Math.max(1, p - 1))}
          onNextPage={() => setPage((p) => Math.min(totalPages, p + 1))}
          selectedCount={selected.length}
          maxSelected={STRATEGY_PATIENT_LIST_MAX_SELECTED}
          submitting={submitting}
          onAdd={addPatient}
        />

        <StrategyPatientSelectedPanel
          title={copy.selectedTitle}
          subtitle={copy.selectedSubtitle}
          selected={selected}
          maxSelected={STRATEGY_PATIENT_LIST_MAX_SELECTED}
          submitting={submitting}
          onRemove={removePatient}
          emptyMessage={copy.emptySelectedMessage}
        />
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
        {selected.length >= STRATEGY_PATIENT_LIST_MAX_SELECTED ? (
          <span className="text-xs text-amber-700">
            Limite de {STRATEGY_PATIENT_LIST_MAX_SELECTED} pacientes atingido.
          </span>
        ) : null}
      </div>
    </form>
  )
}
