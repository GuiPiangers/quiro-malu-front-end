import { Box } from '@/components/box/Box'
import DateTime from '@/utils/Date'
import RouteReplace from '../../../components/RouteReplace'
import { RxCaretDown } from 'react-icons/rx'
import SchedulingModal from '../../../components/modal/SchedulingModal/SchedulingModal'
import { Validate } from '@/services/api/Validate'
import SchedulingCalendar from '@/components/calendar/SchedulingCalendar'
import SchedulingList from '@/components/schedulingList/SchedulingList'
import { listEventsByUser } from '@/services/scheduling/scheduling'
import { listClinicians } from '@/services/clinicUsers/clinicUsers'
import CreateEventModal from '@/components/modal/createEventModal/CreateEventModal'
import { getCalendarConfiguration } from '@/services/config/calendar/calendarConfiguration'
import { getWeekDayKey } from '@/services/config/calendar/calendarUtils'
import Link from 'next/link'
import ClinicianScheduleSelect from './components/ClinicianScheduleSelect'
import { generateSearchParams } from '@/utils/generateSearchParams'
import { redirect } from 'next/navigation'

export default async function Scheduling({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  const date = searchParams.date
    ? searchParams.date
    : DateTime.getIsoDate(new Date())

  const cliniciansRes = await listClinicians()
  const clinicians = Validate.isOk(cliniciansRes) ? cliniciansRes : []

  const selectedUserId =
    searchParams.userId && clinicians.some((c) => c.id === searchParams.userId)
      ? searchParams.userId
      : clinicians[0]?.id

  if (selectedUserId && searchParams.userId !== selectedUserId) {
    redirect(
      generateSearchParams({
        date,
        userId: selectedUserId,
      }),
    )
  }

  const newDate = new Date(
    +date.substring(0, 4),
    +date.substring(5, 7) - 1,
    +date.substring(8, 10),
  )

  const schedulesResp = selectedUserId
    ? await listEventsByUser({ date, userId: selectedUserId })
    : { data: [] }

  const table = await getCalendarConfiguration().then((res) => {
    const dayOfWeek = newDate.getDay()
    const dayKey = getWeekDayKey(dayOfWeek)

    if (!res[dayKey]?.isActive)
      return {
        workSchedules: [],
        workTimeIncrementInMinutes: 30,
      }

    return {
      workSchedules: res[dayKey]?.workSchedules || [],
      workTimeIncrementInMinutes: res.workTimeIncrementInMinutes || 30,
    }
  })

  const buildDateRoute = (dayOffset: number) => {
    const nextDate = DateTime.getIsoDate(
      new Date(
        +date.substring(0, 4),
        +date.substring(5, 7) - 1,
        +date.substring(8, 10) + dayOffset,
      ),
    )
    const params: Record<string, string> = { date: nextDate }
    if (selectedUserId) params.userId = selectedUserId
    return generateSearchParams(params)
  }

  return (
    <div className="flex w-full max-w-screen-xl flex-col-reverse gap-4 md:grid md:grid-cols-[1fr_280px] lg:grid-cols-[1fr_320px]">
      <Box className="h-fit">
        <div className="mb-4 flex flex-col gap-4">
          {clinicians.length > 0 && selectedUserId && (
            <ClinicianScheduleSelect
              clinicians={clinicians}
              selectedUserId={selectedUserId}
              date={date}
            />
          )}
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              <RouteReplace route={buildDateRoute(-1)}>
                <RxCaretDown
                  size={24}
                  className="rotate-90 cursor-pointer rounded text-main hover:bg-slate-100"
                />
              </RouteReplace>
              <span className="text-lg font-semibold text-main">
                {DateTime.getLocaleDate(newDate)}
              </span>
              <RouteReplace route={buildDateRoute(1)}>
                <RxCaretDown
                  size={24}
                  className="-rotate-90 cursor-pointer rounded text-main hover:bg-slate-100"
                />
              </RouteReplace>
            </div>

            <SchedulingModal>Agendar</SchedulingModal>
          </div>
        </div>
        {selectedUserId ? (
          <SchedulingList
            date={date}
            userId={selectedUserId}
            workHours={table}
            schedules={
              Validate.isOk(schedulesResp) ? schedulesResp : { data: [] }
            }
          />
        ) : (
          <p className="text-sm text-slate-500">
            Nenhum profissional disponível para exibir a agenda.
          </p>
        )}
      </Box>
      <Box className="flex w-full flex-col gap-4 place-self-start">
        <SchedulingCalendar />
        <CreateEventModal
          size="small"
          color="black"
          className="w-full"
          variant="outline"
        >
          Bloquear Agenda
        </CreateEventModal>
        <Link
          href={'/config/calendario'}
          className="rounded-md border border-dashed px-4 py-1 text-center text-xs font-bold text-blue-600"
        >
          Alterar configurações de horário
        </Link>
      </Box>
    </div>
  )
}
