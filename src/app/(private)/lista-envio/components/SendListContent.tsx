'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import useWindowSize from '@/hooks/useWindowSize'
import { Box } from '@/components/box/Box'
import Button from '@/components/Button'
import { Table } from '@/components/table'
import NoDataFound from '@/components/notFound/NoDataFound'
import { Validate } from '@/services/api/Validate'
import { listMessageSendStrategies } from '@/services/message/sendList'
import type { ListMessageSendStrategyOutput } from '@/services/message/sendListTypes'
import {
  MESSAGE_SEND_STRATEGY_KIND_LABELS,
  type MessageSendStrategyKind,
} from '../kinds'

type ListaEnvioContentProps = {
  initialData?: ListMessageSendStrategyOutput
}

function labelForSendStrategyKind(kind: string) {
  const label =
    MESSAGE_SEND_STRATEGY_KIND_LABELS[kind as MessageSendStrategyKind]
  return label ?? kind
}

const TABLE_BINDINGS_COLUMN_MIN_WIDTH = 768

export default function ListaEnvioContent({
  initialData,
}: ListaEnvioContentProps) {
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

  const { items, total } = data

  return (
    <div className="flex w-full flex-col gap-6">
      <Box className="w-full max-w-screen-lg">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold text-main">
              Listas cadastradas
            </h3>
            <span className="text-xs text-slate-500">
              {total} {total === 1 ? 'registro' : 'registros'}
            </span>
          </div>
          <Button
            asChild
            color="green"
            variant="solid"
            className="w-full sm:w-auto"
          >
            <Link href="/lista-envio/cadastro">Adicionar</Link>
          </Button>
        </div>
        <div className="mt-1 flex justify-end"></div>
        {isPending && !items.length ? (
          <p className="mt-4 text-sm text-slate-500">Carregando…</p>
        ) : items.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">
            Nenhuma lista de envio cadastrada ainda.
          </p>
        ) : (
          <div className="mt-4">
            <Table.Root>
              <Table.Row
                columns={
                  showBindingsColumn ? ['2fr', '2fr', '1fr'] : ['2fr', '2fr']
                }
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
        )}
      </Box>
    </div>
  )
}
