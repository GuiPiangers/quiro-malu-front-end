import { Box } from '@/components/Box/Box'
import Button from '@/components/Button'
import NoDataFound from '@/components/NoDataFound'
import { AccordionTable } from '@/components/accordionTable'
import {
  SchedulingListResponse,
  SchedulingResponse,
} from '@/services/scheduling/SchedulingService'
import { schedulingService } from '@/services/scheduling/serverScheduling'
import { GenerateWorkHours } from '@/utils/GenerateWorkHours'
import Link from 'next/link'

export default async function Scheduling() {
  const { schedules } = await schedulingService.list({ date: '2023-12-22' })

  const table = new GenerateWorkHours({
    schedulingDuration: 30,
    workSchedules: [
      { start: '07:00', end: '11:00' },
      { start: '13:00', end: '19:00' },
    ],
  }).generate<SchedulingResponse & { patient: string; phone: string }>(
    schedules,
  )

  console.log(table)

  const generateTable = () => {
    return table.map((item) => {
      const [hour, scheduling] = item
      if (scheduling) {
        return (
          <AccordionTable.Item key={scheduling.id}>
            <AccordionTable.Row columns={['1fr', '1fr', '80px']}>
              <AccordionTable.Cell>{scheduling.date}</AccordionTable.Cell>
              <AccordionTable.Cell>{scheduling.service}</AccordionTable.Cell>
              <Button
                asChild
                variant="outline"
                size="small"
                className="justify-self-stretch"
              >
                <Link href={`/patients/${scheduling.id}`}>Fixa</Link>
              </Button>
            </AccordionTable.Row>
            <AccordionTable.Content className="flex justify-between gap-2">
              <div className="space-y-1 text-sm">
                <p>
                  <strong>Nome:</strong> {scheduling.patient}
                </p>
                <p>
                  <strong>Telefone:</strong> {scheduling.service}
                </p>
                <p>
                  <strong>Telefone:</strong> {scheduling.duration}
                </p>
              </div>
              <div className="flex w-28 flex-col gap-2">
                <Button variant="outline" size="small">
                  Contato
                </Button>
                <Button variant="outline" size="small">
                  Agendar
                </Button>
              </div>
            </AccordionTable.Content>
          </AccordionTable.Item>
        )
      }
      return (
        <AccordionTable.Item key={hour}>
          <AccordionTable.Row columns={['1fr', '1fr', '80px']}>
            <AccordionTable.Cell>{hour}</AccordionTable.Cell>
          </AccordionTable.Row>
        </AccordionTable.Item>
      )
    })
  }

  return (
    <div>
      <Box>
        <AccordionTable.Root>{generateTable()}</AccordionTable.Root>
      </Box>
    </div>
  )
}
