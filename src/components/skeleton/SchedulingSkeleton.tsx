import { Skeleton } from '@/components/skeleton/Skeleton'
import { Table } from '@/components/table'
import { GenerateWorkHours } from '@/utils/GenerateWorkHours'

export default function SchedulingSkeleton() {
  const workHours = {
    workTimeIncrement: 30,
    workSchedules: [{ start: '07:00', end: '19:00' }],
  }

  const generateWorkHours = new GenerateWorkHours(workHours)

  return (
    <Table.Root className={'w-full'}>
      {generateWorkHours.generate([]).map((item, index) => (
        <Table.Row
          key={index}
          clickable
          columns={['80px', '1fr']}
          className="py-1"
        >
          <Table.Cell className="w-full">{item[0]}</Table.Cell>

          <Table.Cell className="w-full">
            <Skeleton className="h-6 w-full"></Skeleton>
          </Table.Cell>
        </Table.Row>
      ))}
    </Table.Root>
  )
}
