'use client'

import Button from '@/components/Button'
import HeaderForm from '@/components/modal/HeaderModal'
import Modal, { type ModalHandles } from '@/components/modal/Modal'
import { Validate } from '@/services/api/Validate'
import { listMessageSendStrategies } from '@/services/message/sendList'
import type {
  ListedMessageSendStrategyDTO,
  ListMessageSendStrategyOutput,
} from '@/services/message/sendListTypes'
import {
  MESSAGE_SEND_STRATEGY_KIND_LABELS,
  type MessageSendStrategyKind,
} from '@/app/(private)/lista-envio/kinds'
import { Filter, List, Loader2, Plus, X } from 'lucide-react'
import { useRef } from 'react'
import { useQuery } from '@tanstack/react-query'

export type SendListSelection = {
  id: string
  name: string
}

const LIST_STRATEGIES_PAGE = 1
const LIST_STRATEGIES_LIMIT = 100

type MessageTemplateSendListPickerProps = {
  value: SendListSelection[]
  onChange: (next: SendListSelection[]) => void
  disabled?: boolean
}

function kindLabel(kind: string) {
  return (
    MESSAGE_SEND_STRATEGY_KIND_LABELS[kind as MessageSendStrategyKind] ?? kind
  )
}

export default function MessageTemplateSendListPicker({
  value,
  onChange,
  disabled,
}: MessageTemplateSendListPickerProps) {
  const modalRef = useRef<ModalHandles>(null)

  const strategiesQuery = useQuery({
    queryKey: [
      'messageSendStrategies',
      'list',
      { page: LIST_STRATEGIES_PAGE, limit: LIST_STRATEGIES_LIMIT },
    ] as const,
    queryFn: async (): Promise<ListMessageSendStrategyOutput> => {
      const res = await listMessageSendStrategies({
        page: LIST_STRATEGIES_PAGE,
        limit: LIST_STRATEGIES_LIMIT,
      })
      if (Validate.isError(res)) {
        throw new Error(res.message)
      }
      return res
    },
    enabled: false,
    staleTime: 60_000,
  })

  const openModal = () => {
    modalRef.current?.openModal()
  }

  const closeModal = () => {
    modalRef.current?.closeModal()
  }

  const handleOpenAdd = () => {
    openModal()
    strategiesQuery.refetch()
  }

  const handlePick = (row: ListedMessageSendStrategyDTO) => {
    if (value.some((v) => v.id === row.id)) {
      closeModal()
      return
    }
    onChange([...value, { id: row.id, name: row.name }])
    closeModal()
  }

  const removeAt = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const clearAll = () => {
    onChange([])
  }

  const items = strategiesQuery.data?.items ?? []
  const showFullLoader =
    strategiesQuery.isFetching && strategiesQuery.data === undefined
  const listErrorMessage =
    strategiesQuery.error instanceof Error
      ? strategiesQuery.error.message
      : 'Não foi possível carregar as listas de envio.'

  return (
    <div className="mt-5">
      <p className="mb-1.5 text-sm font-medium text-slate-700">
        Filtros de lista de envio
      </p>
      <p className="mb-3 text-xs text-slate-500">
        Adicione uma ou mais listas de envio como filtros desta campanha. A
        combinação define quais destinatários entram no disparo automático.
      </p>

      <div className="flex flex-col gap-3">
        {value.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {value.map((row, index) => (
              <li
                key={row.id}
                className="flex min-w-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800"
              >
                <List className="h-4 w-4 shrink-0 text-main" />
                <span className="min-w-0 flex-1 truncate font-medium">
                  {row.name}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  disabled={disabled}
                  onClick={() => removeAt(index)}
                  className="shrink-0 p-2"
                  aria-label={`Remover filtro ${row.name}`}
                >
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            onClick={handleOpenAdd}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Adicionar filtro
          </Button>
          {value.length > 0 ? (
            <Button
              type="button"
              variant="outline"
              disabled={disabled}
              onClick={clearAll}
              className="text-slate-600"
            >
              Limpar filtros
            </Button>
          ) : null}
        </div>
      </div>

      <Modal
        ref={modalRef}
        className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden p-0"
      >
        <HeaderForm title="Adicionar filtro" handleClose={closeModal} />
        <div className="flex min-h-0 flex-1 flex-col gap-2 p-4">
          {strategiesQuery.isError &&
          strategiesQuery.data === undefined &&
          listErrorMessage ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {listErrorMessage}
            </p>
          ) : showFullLoader ? (
            <div className="flex items-center justify-center gap-2 py-10 text-sm text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              Carregando…
            </div>
          ) : items.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">
              Nenhuma lista cadastrada. Crie uma em Lista de envio.
            </p>
          ) : (
            <ul className="max-h-[55vh] min-h-0 space-y-1 overflow-y-auto pr-1">
              {items.map((row) => {
                const already = value.some((v) => v.id === row.id)
                return (
                  <li key={row.id}>
                    <button
                      type="button"
                      disabled={already}
                      onClick={() => handlePick(row)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-left text-sm transition hover:border-main hover:bg-purple-50/60 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <span className="flex items-center gap-2 font-medium text-slate-900">
                        <Filter className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                        {row.name}
                        {already ? (
                          <span className="ml-auto text-xs font-normal text-slate-500">
                            Já adicionado
                          </span>
                        ) : null}
                      </span>
                      <span className="mt-0.5 block pl-5 text-xs text-slate-500">
                        {kindLabel(row.kind)}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </Modal>
    </div>
  )
}
