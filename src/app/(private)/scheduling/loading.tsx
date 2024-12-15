import { Box } from '@/components/box/Box'
import SchedulingModal from '@/components/modal/SchedulingModal/SchedulingModal'
import SchedulingSkeleton from '@/components/skeleton/SchedulingSkeleton'
import { Skeleton } from '@/components/skeleton/Skeleton'
import { RxCaretDown } from 'react-icons/rx'

export default function LoadingScheduling() {
  return (
    <div className="flex w-full max-w-screen-xl flex-col-reverse gap-4 md:grid md:grid-cols-[1fr_280px] lg:grid-cols-[1fr_320px]">
      <Box className="">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex gap-1">
            <div>
              <RxCaretDown
                size={24}
                className="rotate-90 cursor-pointer rounded text-main hover:bg-slate-100"
              />
            </div>
            <span className="text-lg font-semibold text-main">
              <Skeleton />
            </span>
            <div>
              <RxCaretDown
                size={24}
                className="-rotate-90 cursor-pointer rounded text-main hover:bg-slate-100"
              />
            </div>
          </div>

          <SchedulingModal>Agendar</SchedulingModal>
        </div>

        <SchedulingSkeleton />
      </Box>

      <Box className="w-full place-self-start">
        <Skeleton className="h-20 md:h-96" />
      </Box>
    </div>
  )
}
