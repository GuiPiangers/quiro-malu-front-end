import { Box } from '@/components/box/Box'
import DateTime from '@/utils/Date'
import RouteReplace from '../../../components/RouteReplace'
import { RxCaretDown } from 'react-icons/rx'
import SchedulingModal from '../../../components/modal/SchedulingModal/SchedulingModal'
import { Validate } from '@/services/api/Validate'
import SchedulingCalendar from '@/components/calendar/SchedulingCalendar'
import SchedulingList from '@/components/schedulingList/SchedulingList'
import { listEvents } from '@/services/scheduling/scheduling'
import CreateEventModal from '@/components/modal/createEventModal/CreateEventModal'
import { getCalendarConfiguration } from '@/services/config/calendar/calendarConfiguration'
import { getWeekDayKey } from '@/services/config/calendar/calendarUtils'

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

  const schedulesResp = await listEvents({ date })
  const table = (await getCalendarConfiguration().then((res) => {
    if (Validate.isOk(res) && res) {
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
    }
  })) || {
    workTimeIncrementInMinutes: 30,
    workSchedules: [
      { start: '07:00', end: '11:00' },
      { start: '13:00', end: '19:00' },
    ],
  }

  const incDate = (number: number) =>
    `?date=${DateTime.getIsoDate(
      new Date(
        +date.substring(0, 4),
        +date.substring(5, 7) - 1,
        +date.substring(8, 10) + number,
      ),
    )}`

  return (
    <div className="flex w-full max-w-screen-xl flex-col-reverse gap-4 md:grid md:grid-cols-[1fr_280px] lg:grid-cols-[1fr_320px]">
      <Box className="">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex gap-1">
            <RouteReplace route={incDate(-1)}>
              <RxCaretDown
                size={24}
                className="rotate-90 cursor-pointer rounded text-main hover:bg-slate-100"
              />
            </RouteReplace>
            <span className="text-lg font-semibold text-main">
              {DateTime.getLocaleDate(newDate)}
            </span>
            <RouteReplace route={incDate(1)}>
              <RxCaretDown
                size={24}
                className="-rotate-90 cursor-pointer rounded text-main hover:bg-slate-100"
              />
            </RouteReplace>
          </div>

          <SchedulingModal>Agendar</SchedulingModal>
        </div>
        <SchedulingList
          date={date}
          workHours={table}
          schedules={
            Validate.isOk(schedulesResp) ? schedulesResp : { data: [] }
          }
        />
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
      </Box>
    </div>
  )
}
