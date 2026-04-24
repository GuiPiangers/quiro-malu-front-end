'use client'

import { SchedulingStatus } from '@/services/scheduling/scheduling'
import Button from '../Button'
import { Input } from '../input'
import { useUpdateScheduling } from '@/hooks/scheduling/useUpdateScheduling'
import { isSchedulingStartInPast } from '@/utils/schedulingDisplayStatus'

export default function StatusSelect({
  status,
  schedulingId,
  date,
  color,
  duration,
}: {
  status: SchedulingStatus
  schedulingId: string
  date: string
  color?: 'blue' | 'green' | 'red' | 'yellow'
  duration: number
}) {
  const updateScheduling = useUpdateScheduling()
  const isPastSchedulingStart = isSchedulingStartInPast(date)

  const getSelectedStatus = (status: SchedulingStatus) => {
    return status === 'Agendado' || status === 'Atrasado' ? 'Agendado' : status
  }

  const saveStatus = ({
    schedulingId,
    status,
  }: {
    schedulingId: string
    status: SchedulingStatus
  }) => {
    updateScheduling.mutate({
      id: schedulingId,
      status,
      date,
      duration,
    })
  }

  return (
    <Input.Root>
      <Button
        asChild
        className="min-w-[126px] justify-start text-sm text-current hover:bg-slate-300 hover:text-current"
        variant="outline"
        size="small"
        color={color || 'blue'}
      >
        <Input.Select
          value={getSelectedStatus(status)}
          onChange={async (_, value) => {
            const newStatus = value as SchedulingStatus
            saveStatus({
              schedulingId,
              status: newStatus,
            })
          }}
        >
          <Input.Option
            value={'Agendado'}
            className={isPastSchedulingStart ? 'text-red-600' : 'text-blue-600'}
          >
            {isPastSchedulingStart ? 'Atrasado' : 'Agendado'}
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
