import {
  SchedulingListResponse,
  SchedulingResponse,
  deleteScheduling,
} from '@/services/scheduling/actions/scheduling'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'

export function useDeleteScheduling() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const searchParams = useSearchParams()

  const date = searchParams.get('date')

  const mutation = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const result = await deleteScheduling({ id })
      router.refresh()
      return result
    },
    onMutate: async (deleteSchedulingData) => {
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
            (launch) => launch.id !== deleteSchedulingData.id,
          )

          return { ...oldQuery, service: updatedLaunches }
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
        queryKey: ['listSchedules', date],
      })
    },
  })

  return mutation
}
