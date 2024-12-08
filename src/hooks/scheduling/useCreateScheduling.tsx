import { Validate } from '@/services/api/Validate'
import {
  createScheduling,
  SchedulingListResponse,
  SchedulingResponse,
} from '@/services/scheduling/actions/scheduling'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'

export function useCreateScheduling() {
  const searchParams = useSearchParams()
  const date = searchParams.get('date')
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (
      newScheduling: SchedulingResponse & { patient: string; phone: string },
    ) => {
      return createScheduling(newScheduling)
    },
    onSuccess: async (response, scheduling) => {
      if (Validate.isOk(response)) {
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

        await queryClient.cancelQueries({
          queryKey: ['listSchedules', date],
        })

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
      }
      return response
    },

    // onError: (_err, newTodo, context) => {
    //   queryClient.setQueryData(
    //     ['listSchedules', date],
    //     context?.previousLaunches,
    //   )
    // },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['listSchedules', date],
      })
    },
  })

  return mutation
}
