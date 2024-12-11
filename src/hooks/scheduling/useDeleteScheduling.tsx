import {
  SchedulingResponse,
  deleteScheduling,
} from '@/services/scheduling/actions/scheduling'
import { SchedulingListResponse } from '@/services/scheduling/SchedulingService'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'

export function useDeleteScheduling() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const searchParams = useSearchParams()

  const date = searchParams.get('date')

  const mutation = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      await deleteScheduling({ id })
      router.refresh()
    },
    onMutate: async (updateSchedulingData) => {
      await queryClient.cancelQueries({
        queryKey: ['listSchedules', date],
      })

      const previousLaunches = queryClient.getQueryData<SchedulingResponse[]>([
        'listSchedules',
        date,
      ])

      queryClient.setQueryData<SchedulingListResponse>(
        ['listSchedules', date],
        (oldQuery) => {
          if (!oldQuery) return oldQuery

          const updatedLaunches = oldQuery.schedules.filter(
            (launch) => launch.id !== updateSchedulingData.id,
          )

          return { ...oldQuery, schedules: updatedLaunches }
        },
      )
      return { previousLaunches }
    },

    onError: (_err, newTodo, context) => {
      queryClient.setQueryData(
        ['listSchedules', date],
        context?.previousLaunches,
      )
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['listSchedules'],
      })
    },
  })

  return mutation
}
