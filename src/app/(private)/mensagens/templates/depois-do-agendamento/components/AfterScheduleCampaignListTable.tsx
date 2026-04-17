'use client'

import { Table } from '@/components/table'
import type { AfterScheduleMessageResponse } from '@/services/message/afterScheduleMessageTypes'
import { useRouter } from 'next/navigation'
import DeleteAfterScheduleCampaign from './DeleteAfterScheduleCampaign'

const BASE = '/mensagens/templates/depois-do-agendamento'

type AfterScheduleCampaignListTableProps = {
  campaigns: AfterScheduleMessageResponse[]
}

export default function AfterScheduleCampaignListTable({
  campaigns,
}: AfterScheduleCampaignListTableProps) {
  const router = useRouter()

  if (campaigns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 py-12 text-center text-slate-500">
        <p>Nenhuma campanha cadastrada ainda.</p>
        <p className="text-sm">
          Clique em &quot;Nova Campanha&quot; para começar.
        </p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-screen-lg">
      <Table.Root>
        <Table.Row columns={['1fr', 'auto', 'auto']}>
          <Table.Head>Nome da Campanha</Table.Head>
          <Table.Head>Status</Table.Head>
          <Table.Head className="text-right">Ações</Table.Head>
        </Table.Row>

        {campaigns.map((campaign) => (
          <Table.Row
            key={campaign.id}
            columns={['1fr', 'auto', 'auto']}
            clickable
            handleOnClick={() => router.push(`${BASE}/${campaign.id}`)}
          >
            <Table.Cell className="font-medium text-slate-800">
              {campaign.name}
            </Table.Cell>
            <Table.Cell>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  campaign.active
                    ? 'bg-green-100 text-green-700'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {campaign.active ? 'Ativo' : 'Inativo'}
              </span>
            </Table.Cell>
            <Table.Cell
              className="flex justify-end"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              {campaign.id ? (
                <DeleteAfterScheduleCampaign
                  id={campaign.id}
                  campaignName={campaign.name}
                />
              ) : null}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Root>
    </div>
  )
}
