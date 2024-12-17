import {
  createScheduling,
  SchedulingListResponse,
  SchedulingResponse,
} from '@/services/scheduling/scheduling'
import DateTime from '@/utils/Date'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'

export function useCreateScheduling() {
  const searchParams = useSearchParams()
  const date = searchParams.get('date') || DateTime.getIsoDate(new Date())
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (
      newScheduling: SchedulingResponse & { patient: string; phone: string },
    ) => {
      return createScheduling(newScheduling)
    },
    onMutate: async (scheduling) => {
      const previousLaunches = queryClient.getQueryData<SchedulingResponse[]>([
        'listSchedules',
        date,
      ])

      await queryClient.cancelQueries({
        queryKey: ['listSchedules', date],
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
        ...(scheduling as SchedulingResponse & {
          patient: string
          phone: string
        }),
        status,
      }

      queryClient.setQueryData<SchedulingListResponse>(
        ['listSchedules', date],
        (oldQuery) => {
          if (!oldQuery) return oldQuery

          return {
            ...oldQuery,
            schedules: [...oldQuery.schedules, newScheduling],
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
