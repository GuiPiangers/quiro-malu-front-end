'use client'

import { SchedulingStatus } from '@/services/scheduling/SchedulingService'
import Button from '../Button'
import { Input } from '../input'
import { clientSchedulingService } from '@/services/scheduling/clientScheduling'
import { useRouter } from 'next/navigation'

export default function StatusSelect({
  status,
  schedulingId,
  color,
}: {
  status: SchedulingStatus
  schedulingId: string
  color?: 'blue' | 'green' | 'red' | 'yellow'
}) {
  const getSelectedStatus = (status: SchedulingStatus) => {
    return status === 'Agendado' || status === 'Atrasado' ? 'Agendado' : status
  }

  const saveStatus = async ({
    schedulingId,
    status,
  }: {
    schedulingId: string
    status: SchedulingStatus
  }) => {
    await clientSchedulingService.update({
      id: schedulingId,
      status,
    })
  }

  const router = useRouter()

  return (
    <Input.Root>
      <Button
        asChild
        className="min-w-[112px] justify-start text-sm text-current hover:bg-slate-300 hover:text-current"
        variant="outline"
        size="small"
        color={color || 'blue'}
      >
        <Input.Select
          value={getSelectedStatus(status)}
          onChange={async (_, value) => {
            const newStatus = value as SchedulingStatus
            await saveStatus({
              schedulingId,
              status: newStatus,
            })
            router.refresh()
          }}
        >
          <Input.Option value={'Agendado'} className="text-blue-600">
            {status === 'Atrasado' ? 'Atrasado' : 'Agendado'}
          </Input.Option>
          <Input.Option value={'Atendido'} className="text-green-600">
            Atendido
          </Input.Option>
          <Input.Option value={'Cancelado'} className="text-orange-600">
            Cancelado
          </Input.Option>
        </Input.Select>
      </Button>
    </Input.Root>
  )
}
