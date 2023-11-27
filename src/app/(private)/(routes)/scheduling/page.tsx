import { Box } from '@/components/Box/Box'
import Button from '@/components/Button'
import { AccordionTable } from '@/components/accordionTable'
import Calendar from '@/components/calendar/Calendar'
import { Table } from '@/components/table'
import { SchedulingResponse } from '@/services/scheduling/SchedulingService'
import { schedulingService } from '@/services/scheduling/serverScheduling'
import DateTime from '@/utils/Date'
import { GenerateWorkHours } from '@/utils/GenerateWorkHours'
import { Time } from '@/utils/Time'
import Link from 'next/link'
import Navigate from './Navigate'
import { RxCaretDown } from 'react-icons/rx'

export default async function Scheduling({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  const date = searchParams.date
    ? searchParams.date
    : DateTime.getIsoDate(new Date())

  const newDate = new Date(
    +date.substring(0, 4),
    +date.substring(5, 7) - 1,
    +date.substring(8, 10),
  )

  const [{ schedules }, qdtSchedules] = await Promise.all([
    schedulingService.list({ date }),
    schedulingService.getQtdSchedulesByDay({
      year: newDate.getFullYear(),
      month: newDate.getMonth() + 1,
    }),
  ])

  console.log(qdtSchedules)

  const table = new GenerateWorkHours({
    schedulingDuration: 30,
    workSchedules: [
      { start: '07:00', end: '11:00' },
      { start: '13:00', end: '19:00' },
    ],
  }).generate<SchedulingResponse & { patient: string; phone: string }>(
    schedules,
  )

  const incDate = (number: number) =>
    `?date=${DateTime.getIsoDate(
      new Date(
        +date.substring(0, 4),
        +date.substring(5, 7) - 1,
        +date.substring(8, 10) + number,
      ),
    )}`

  const generateTable = () => {
    return table.map((item) => {
      const [hour, scheduling] = item
      if (scheduling) {
        const durationString = new Time(
          scheduling.duration,
        ).getHoursAndMinutes()

        const status =
          scheduling.status === 'Agendado' &&
          scheduling.date < new Date().toISOString()
            ? 'Atrasado'
            : scheduling.status

        return (
          <AccordionTable.Item key={scheduling.id}>
            <AccordionTable.Row
              columns={['2fr', '2fr', '1fr']}
              data-status={status}
              className={`${status === 'Agendado' && 'text-blue-600'} ${
                status === 'Atendido' && 'text-green-600'
              } ${status === 'Atrasado' && 'text-red-600'}`}
            >
              <AccordionTable.Cell>
                {hour} {'('}
                {durationString}
                {')'}
              </AccordionTable.Cell>
              <AccordionTable.Cell>{scheduling.patient}</AccordionTable.Cell>
              <AccordionTable.Cell>{status}</AccordionTable.Cell>
            </AccordionTable.Row>
            <AccordionTable.Content className="flex justify-between gap-2">
              <div className="space-y-1 text-sm">
                <p>
                  <strong>Paciente:</strong> {scheduling.patient}
                </p>
                <p>
                  <strong>Serviço:</strong> {scheduling.service}
                </p>
                <p>
                  <strong>Duração:</strong> {durationString}
                </p>
                <div className="flex gap-2 pt-2 ">
                  <Button
                    variant="outline"
                    size="small"
                    color="blue"
                    className="w-20"
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="small"
                    color="red"
                    className="w-20"
                  >
                    Excluir
                  </Button>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button size="small">Realizar atendimento</Button>
                <Button variant="outline" size="small">
                  Entrar em Contato
                </Button>
                <Button asChild variant="outline" size="small">
                  <Link href={`/patients/${scheduling.patientId}`}>
                    Fixa do paciente
                  </Link>
                </Button>
              </div>
            </AccordionTable.Content>
          </AccordionTable.Item>
        )
      }
      return (
        <Table.Row
          clickable
          key={hour}
          columns={['auto', '1fr']}
          className="group"
        >
          <Table.Cell>{hour}</Table.Cell>
          <Table.Cell className="pointer-events-none w-full rounded border border-slate-300 text-center text-slate-400 opacity-0 group-hover:opacity-100">
            Novo Agendamento
          </Table.Cell>
        </Table.Row>
      )
    })
  }

  return (
    <div className="grid w-full max-w-screen-xl grid-cols-[1fr_320px] gap-4">
      <Box className="">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex gap-1">
            <Navigate route={incDate(-1)}>
              <RxCaretDown
                size={24}
                className="rotate-90 cursor-pointer rounded text-main hover:bg-slate-100"
              />
            </Navigate>
            <span className="text-lg font-semibold text-main">
              {newDate.toLocaleDateString()}
            </span>
            <Navigate route={incDate(1)}>
              <RxCaretDown
                size={24}
                className="-rotate-90 cursor-pointer rounded text-main hover:bg-slate-100"
              />
            </Navigate>
          </div>

          <Button color="green">Agendar</Button>
        </div>
        <AccordionTable.Root>{generateTable()}</AccordionTable.Root>
      </Box>
      <Box className="w-full place-self-start">
        <Calendar />
      </Box>
    </div>
  )
}
