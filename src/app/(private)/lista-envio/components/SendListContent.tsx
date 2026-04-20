'use client'

import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import useWindowSize from '@/hooks/useWindowSize'
import { Table } from '@/components/table'
import NoDataFound from '@/components/notFound/NoDataFound'
import { Validate } from '@/services/api/Validate'
import { listMessageSendStrategies } from '@/services/message/sendList'
import type { ListMessageSendStrategyOutput } from '@/services/message/sendListTypes'
import {
  MESSAGE_SEND_STRATEGY_KIND_LABELS,
  type MessageSendStrategyKind,
} from '../kinds'

type SendListContentProps = {
  initialData?: ListMessageSendStrategyOutput
}

function labelForSendStrategyKind(kind: string) {
  const label =
    MESSAGE_SEND_STRATEGY_KIND_LABELS[kind as MessageSendStrategyKind]
  return label ?? kind
}

const TABLE_BINDINGS_COLUMN_MIN_WIDTH = 768

export default function SendListContent({ initialData }: SendListContentProps) {
  const router = useRouter()
  const { windowWidth } = useWindowSize()
  const showBindingsColumn = windowWidth >= TABLE_BINDINGS_COLUMN_MIN_WIDTH

  const { data, isPending } = useQuery({
    queryKey: ['messageSendStrategies'],
    queryFn: async () => listMessageSendStrategies({ page: 1, limit: 100 }),
    initialData,
  })

  if (Validate.isError(data) || !data) {
    return <NoDataFound />
  }

  const { items } = data

  if (isPending && !items.length) {
    return (
      <div className="mt-4">
        <p className="text-sm text-slate-500">Carregando…</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="mt-4">
        <p className="text-sm text-slate-500">
          Nenhuma lista de envio cadastrada ainda.
        </p>
      </div>
    )
  }

  return (
    <div className="mt-4">
      <Table.Root>
        <Table.Row
          columns={showBindingsColumn ? ['2fr', '2fr', '1fr'] : ['2fr', '2fr']}
        >
          <Table.Head>Nome</Table.Head>
          <Table.Head>Tipo</Table.Head>
          {showBindingsColumn ? (
            <Table.Head>Campanhas vinculadas</Table.Head>
          ) : null}
        </Table.Row>
        {items.map((row) => (
          <Table.Row
            key={row.id}
            clickable
            className="cursor-pointer"
            handleOnClick={() => router.push(`/lista-envio/${row.id}/editar`)}
            columns={
              showBindingsColumn ? ['2fr', '2fr', '1fr'] : ['2fr', '2fr']
            }
          >
            <Table.Cell className="font-medium text-slate-800">
              {row.name || '—'}
            </Table.Cell>
            <Table.Cell className="text-slate-800">
              {row.kind ? labelForSendStrategyKind(row.kind) : '—'}
            </Table.Cell>
            {showBindingsColumn ? (
              <Table.Cell className="tabular-nums text-slate-700">
                {typeof row.campaignBindingsCount === 'number'
                  ? row.campaignBindingsCount
                  : '—'}
              </Table.Cell>
            ) : null}
          </Table.Row>
        ))}
      </Table.Root>
    </div>
  )
}
