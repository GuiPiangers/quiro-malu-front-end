import {
  EventsResponse,
  deleteScheduling,
} from '@/services/scheduling/scheduling'
import DateTime from '@/utils/Date'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'

export function useDeleteScheduling() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const searchParams = useSearchParams()

  const date = searchParams.get('date') || DateTime.getIsoDate(new Date())

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

      const previousLaunches = queryClient.getQueryData<EventsResponse>([
        'listSchedules',
        date,
      ])

      queryClient.setQueryData<EventsResponse>(
        ['listSchedules', date],
        (oldQuery) => {
          if (!oldQuery) return oldQuery

          const updatedLaunches = oldQuery.data.filter(
            (launch) => launch.id !== deleteSchedulingData.id,
          )

          return { ...oldQuery, data: updatedLaunches }
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
