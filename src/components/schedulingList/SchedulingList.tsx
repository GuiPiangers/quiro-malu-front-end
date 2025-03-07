'use client'

import {
  SchedulingResponse,
  listSchedules,
} from '@/services/scheduling/scheduling'
import {
  GenerateWorkHours,
  GenerateWorkHoursProps,
} from '@/utils/GenerateWorkHours'
import { Time } from '@/utils/Time'
import { AccordionTable } from '../accordionTable'
import DeleteSchedulingButton from '@/app/(private)/scheduling/components/DeleteSchedulingButton'
import RealizeScheduling from '@/app/(private)/scheduling/(realizeScheduling)/components/RealizeScheduling'
import Button from '../Button'
import Link from 'next/link'
import { Table } from '../table'
import DateTime from '@/utils/Date'
import StopPropagation from '../StopPropagation'
import StatusSelect from './StatusSelect'
import { useQuery } from '@tanstack/react-query'
import { SchedulingStatusEnum } from '@/services/scheduling/schedulingStatusEnum'
import { Validate } from '@/services/api/Validate'
import { useRef, useState } from 'react'
import { ModalHandles } from '../modal/Modal'
import SchedulingModalContent from '../modal/SchedulingModal/SchedulingModalContent'
import Phone from '@/utils/Phone'

type SchedulingListProps = {
  date: string
  workHours: GenerateWorkHoursProps
  schedules: Array<
    { date: string; duration: number } & SchedulingResponse & {
        patient: string
        phone: string
      }
  >
}

const statusColors = {
  [SchedulingStatusEnum.scheduled]: 'blue',
  [SchedulingStatusEnum.late]: 'red',
  [SchedulingStatusEnum.attended]: 'green',
  [SchedulingStatusEnum.canceled]: 'yellow',
} as Record<string, 'blue' | 'green' | 'red' | 'yellow'>

export default function SchedulingList({
  date,
  workHours,
  schedules,
}: SchedulingListProps) {
  const { data } = useQuery({
    queryKey: ['listSchedules', date],
    queryFn: async () =>
      await listSchedules({
        date,
      }),
    initialData: {
      schedules,
    },
  })
  const modalRef = useRef<ModalHandles>(null)

  const openModal = modalRef.current?.openModal
  const [modalData, setModalData] = useState<
    Partial<
      SchedulingResponse & {
        patient: string
        patientPhone: string
      }
    >
  >()

  const generateWorkHours = new GenerateWorkHours(workHours)
  const table = generateWorkHours.generate(
    Validate.isOk(data) ? data.schedules : schedules,
  )

  if (!DateTime.validateDate(date))
    throw new Error('A data informada está incorreta')

  return (
    <>
      <AccordionTable.Root>
        {table.map((item) => {
          const [hour, scheduling] = item
          if (scheduling) {
            const durationString = new Time(
              scheduling.duration,
            ).getHoursAndMinutes()

            return (
              <AccordionTable.Item key={scheduling.id}>
                <AccordionTable.Row
                  columns={['2fr', '2fr', '1fr']}
                  data-status={scheduling.status}
                  className={`${
                    statusColors[scheduling.status] === 'blue' &&
                    'text-blue-600'
                  } ${
                    statusColors[scheduling.status] === 'green' &&
                    'text-green-600'
                  } ${
                    statusColors[scheduling.status] === 'red' && 'text-red-600'
                  }
                ${
                  statusColors[scheduling.status] === 'yellow' &&
                  'text-orange-600 opacity-60'
                }
                `}
                >
                  <AccordionTable.Cell>
                    {hour} {'('}
                    {durationString}
                    {')'}
                  </AccordionTable.Cell>

                  <AccordionTable.Cell>
                    {scheduling.patient}
                  </AccordionTable.Cell>
                  <StopPropagation>
                    <AccordionTable.Cell>
                      <StatusSelect
                        duration={scheduling.duration}
                        date={scheduling.date}
                        schedulingId={scheduling.id || ''}
                        status={scheduling.status}
                        color={statusColors[scheduling.status]}
                      ></StatusSelect>
                    </AccordionTable.Cell>
                  </StopPropagation>
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
                        onClick={() => {
                          openModal && openModal()
                          setModalData({
                            ...scheduling,
                            service: scheduling.service,
                            patientPhone: scheduling.phone,
                          })
                        }}
                      >
                        Editar
                      </Button>
                      <DeleteSchedulingButton id={scheduling.id!} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <RealizeScheduling
                      size="small"
                      formData={{
                        date: scheduling.date,
                        patientId: scheduling.patientId,
                        schedulingId: scheduling.id!,
                        service: scheduling.service,
                        patient: scheduling.patient,
                      }}
                    >
                      Realizar consulta
                    </RealizeScheduling>
                    <Button variant="outline" size="small">
                      <Link
                        href={`https://wa.me/55${Phone.unformat(
                          scheduling.phone || '',
                        )}`}
                        target="_blank"
                      >
                        Contato
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="small">
                      <Link href={`/patients/${scheduling.patientId}`}>
                        Ficha
                      </Link>
                    </Button>
                  </div>
                </AccordionTable.Content>
              </AccordionTable.Item>
            )
          }
          return (
            <Button
              key={hour}
              className="contents text-black"
              onClick={() => {
                openModal && openModal()
                setModalData({ date: `${date}T${hour}` })
              }}
            >
              <Table.Row clickable columns={['auto', '1fr']} className="group">
                <Table.Cell>{hour}</Table.Cell>
                <Table.Cell className="pointer-events-none w-full rounded border border-slate-300 text-center text-slate-400 opacity-0 group-hover:opacity-100">
                  Novo Agendamento
                </Table.Cell>
              </Table.Row>
            </Button>
          )
        })}
      </AccordionTable.Root>

      <SchedulingModalContent
        ref={modalRef}
        formData={modalData}
      ></SchedulingModalContent>
    </>
  )
}
