'use client'

import Button from '@/components/Button'
import HeaderForm from '@/components/modal/HeaderModal'
import Modal, { type ModalHandles } from '@/components/modal/Modal'
import { Validate } from '@/services/api/Validate'
import { listMessageSendStrategies } from '@/services/message/sendList'
import type { ListedMessageSendStrategyDTO } from '@/services/message/sendListTypes'
import {
  MESSAGE_SEND_STRATEGY_KIND_LABELS,
  type MessageSendStrategyKind,
} from '@/app/(private)/lista-envio/kinds'
import { List, Loader2, X } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'

export type SendListSelection = {
  id: string
  name: string
}

type MessageTemplateSendListPickerProps = {
  value: SendListSelection | null
  onChange: (next: SendListSelection | null) => void
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
  const [items, setItems] = useState<ListedMessageSendStrategyDTO[]>([])
  const [loading, setLoading] = useState(false)
  const [listError, setListError] = useState<string | null>(null)

  const openModal = () => {
    modalRef.current?.openModal()
  }

  const closeModal = () => {
    modalRef.current?.closeModal()
  }

  const loadStrategies = useCallback(async () => {
    setLoading(true)
    setListError(null)
    const res = await listMessageSendStrategies({ page: 1, limit: 100 })
    setLoading(false)
    if (Validate.isError(res)) {
      setListError(res.message)
      setItems([])
      return
    }
    setItems(res.items)
  }, [])

  const handleOpen = () => {
    openModal()
    loadStrategies().catch(() => {
      /* setListError inside loadStrategies */
    })
  }

  const handlePick = (row: ListedMessageSendStrategyDTO) => {
    onChange({ id: row.id, name: row.name })
    closeModal()
  }

  return (
    <div className="mt-5">
      <p className="mb-1.5 text-sm font-medium text-slate-700">
        Lista de envio
      </p>
      <p className="mb-3 text-xs text-slate-500">
        Vincule uma lista de envio a esta campanha para aplicar a estratégia de
        destinatários ao disparo automático
      </p>

      <div className="flex flex-wrap items-center gap-2">
        {value ? (
          <>
            <div className="flex min-w-0 max-w-full flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800">
              <List className="h-4 w-4 shrink-0 text-main" />
              <span className="min-w-0 truncate font-medium">{value.name}</span>
            </div>
            <Button
              type="button"
              variant="outline"
              disabled={disabled}
              onClick={handleOpen}
            >
              Alterar
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={disabled}
              onClick={() => onChange(null)}
              className="shrink-0 p-2"
              aria-label="Remover lista de envio"
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            onClick={handleOpen}
            className="flex items-center gap-2"
          >
            <List className="h-4 w-4" />
            Selecionar lista
          </Button>
        )}
      </div>

      <Modal
        ref={modalRef}
        className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden p-0"
      >
        <HeaderForm title="Listas de envio" handleClose={closeModal} />
        <div className="flex min-h-0 flex-1 flex-col gap-2 p-4">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-10 text-sm text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              Carregando…
            </div>
          ) : listError ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {listError}
            </p>
          ) : items.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">
              Nenhuma lista cadastrada. Crie uma em Lista de envio.
            </p>
          ) : (
            <ul className="max-h-[55vh] min-h-0 space-y-1 overflow-y-auto pr-1">
              {items.map((row) => (
                <li key={row.id}>
                  <button
                    type="button"
                    onClick={() => handlePick(row)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-left text-sm transition hover:border-main hover:bg-purple-50/60"
                  >
                    <span className="block font-medium text-slate-900">
                      {row.name}
                    </span>
                    <span className="mt-0.5 block text-xs text-slate-500">
                      {kindLabel(row.kind)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Modal>
    </div>
  )
}
