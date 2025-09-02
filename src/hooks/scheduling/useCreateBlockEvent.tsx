import {
  EventsResponse,
  saveBlockEvent,
  SaveBlockEvent,
} from '@/services/scheduling/scheduling'
import DateTime from '@/utils/Date'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'

export function useCreateBlockEvent() {
  const searchParams = useSearchParams()
  const date = searchParams.get('date') || DateTime.getIsoDate(new Date())
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (newEvent: SaveBlockEvent & { id?: string }) => {
      return saveBlockEvent(newEvent)
    },
    onMutate: async (event) => {
      const previousLaunches = queryClient.getQueryData<EventsResponse>([
        'listSchedules',
        date,
      ])

      await queryClient.cancelQueries({
        queryKey: ['listSchedules', date],
      })

      queryClient.setQueryData<EventsResponse>(
        ['listSchedules', date],
        (oldQuery) => {
          if (!oldQuery) return oldQuery

          return {
            ...oldQuery,
            data: [...oldQuery.data, event],
          }
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
