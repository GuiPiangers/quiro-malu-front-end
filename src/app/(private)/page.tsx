import { Logo } from '@/components/logo'
import UserProfile from '@/app/(private)/components/UserProfile'
import { Table } from '@/components/table'
import DateTime from '@/utils/Date'
import { schedulingService } from '@/services/scheduling/serverScheduling'
import SchedulingList from '@/components/schedulingList/SchedulingList'
import { Validate } from '@/services/api/Validate'
import { GenerateWorkHours } from '@/utils/GenerateWorkHours'
import { Box } from '@/components/box/Box'
import Link from 'next/link'

export default async function Home() {
  const date = DateTime.getIsoDate(new Date())
  const schedulesResp = await schedulingService.list({ date })

  return (
    <section className="flex w-full justify-center">
      <Box className="w-full max-w-screen-xl">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl  text-main">
            Agendamentos de hoje -{' '}
            <strong>{DateTime.getLocaleDate(date)}</strong>
          </h2>
          {Validate.isOk(schedulesResp) &&
          schedulesResp.schedules.length > 0 ? (
            <SchedulingList
              date={date}
              generateWorkHours={
                new GenerateWorkHours({
                  workTimeIncrement: 30,
                  workSchedules: [{ start: '01:00', end: '00:00' }],
                })
              }
              schedules={
                Validate.isOk(schedulesResp) ? schedulesResp.schedules : []
              }
            />
          ) : (
            <div className="mt-2 text-slate-600">
              <span>Nenhum agendamento encontrado</span>
            </div>
          )}
        </div>
        <Link
          className="mt-2 block w-full rounded-md border py-1 text-center text-slate-600 hover:bg-slate-100"
          href={'/scheduling'}
        >
          Ver Mais
        </Link>
      </Box>
    </section>
  )
}
