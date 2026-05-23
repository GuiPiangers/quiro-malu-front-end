import {
  createScheduling,
  EventsResponse,
  SchedulingWithPatient,
} from '@/services/scheduling/scheduling'
import { schedulesQtdQueryKey } from '@/services/scheduling/schedulingQueryKeys'
import DateTime from '@/utils/Date'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'

export function useCreateScheduling() {
  const searchParams = useSearchParams()
  const date = searchParams.get('date') || DateTime.getIsoDate(new Date())
  const userId = searchParams.get('userId') ?? ''
  const queryClient = useQueryClient()
  const listSchedulesKey = ['listSchedules', date, userId] as const

  const mutation = useMutation({
    mutationFn: (newScheduling: SchedulingWithPatient & { userId: string }) => {
      return createScheduling(newScheduling)
    },
    onMutate: async (scheduling) => {
      const previousLaunches =
        queryClient.getQueryData<EventsResponse>(listSchedulesKey)

      await queryClient.cancelQueries({
        queryKey: listSchedulesKey,
      })

      const isLate =
        scheduling.date &&
        new Date().toISOString() > new Date(scheduling.date).toISOString()

      const isAppointed =
        scheduling.status === 'Atrasado' || scheduling.status === 'Agendado'

      const status = isAppointed
        ? isLate
          ? 'Atrasado'
          : 'Agendado'
        : scheduling.status

      const newScheduling = {
        ...(scheduling as SchedulingWithPatient),
        status,
      }

      queryClient.setQueryData<EventsResponse>(listSchedulesKey, (oldQuery) => {
        if (!oldQuery) return oldQuery

        return {
          ...oldQuery,
          data: [...oldQuery.data, newScheduling],
        }
      })

      return { previousLaunches }
    },

    onError: (_err, newTodo, context) => {
      queryClient.setQueryData(listSchedulesKey, context?.previousLaunches)
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['listSchedules'],
      })
      queryClient.invalidateQueries({
        queryKey: schedulesQtdQueryKey.all(),
      })
    },
  })

  return mutation
}
