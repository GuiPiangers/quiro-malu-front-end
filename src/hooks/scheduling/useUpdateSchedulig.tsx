import {
  updateScheduling,
  SchedulingResponse,
} from '@/services/scheduling/actions/scheduling'
import { SchedulingListResponse } from '@/services/scheduling/SchedulingService'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'

export function useUpdateScheduling() {
  const queryClient = useQueryClient()

  const searchParams = useSearchParams()

  const month = searchParams.get('date')
    ? new Date(searchParams.get('date')!).getMonth()
    : new Date().getMonth()

  const year = searchParams.get('year')
    ? new Date(searchParams.get('date')!).getFullYear()
    : new Date().getFullYear()

  const mutation = useMutation({
    mutationFn: async (data: Partial<SchedulingResponse>) => {
      await updateScheduling(data)
    },
    onMutate: async (updateSchedulingData) => {
      const isLate =
        updateSchedulingData.date &&
        new Date().toISOString() >
          new Date(updateSchedulingData.date).toISOString()

      const isAppointed =
        updateSchedulingData.status === 'Atrasado' ||
        updateSchedulingData.status === 'Agendado'

      await queryClient.cancelQueries({
        queryKey: ['listSchedules', { month, year }],
      })

      const previousLaunches = queryClient.getQueryData<SchedulingResponse[]>([
        'listSchedules',
        { month, year },
      ])

      queryClient.setQueryData<SchedulingListResponse>(
        ['listSchedules', { month, year }],
        (oldQuery) => {
          if (!oldQuery) return oldQuery

          const updatedLaunches = oldQuery.schedules.map((launch) => {
            if (launch.id === updateSchedulingData.id) {
              const updateStatus = isAppointed
                ? isLate
                  ? 'Atrasado'
                  : 'Agendado'
                : updateSchedulingData.status ?? launch.status

              return {
                ...launch,
                ...updateSchedulingData,
                status: updateStatus,
              }
            }

            return launch
          })

          return { ...oldQuery, schedules: updatedLaunches }
        },
      )
      return { previousLaunches }
    },

    onError: (_err, newTodo, context) => {
      queryClient.setQueryData(
        ['listSchedules', { month, year }],
        context?.previousLaunches,
      )
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['listSchedules', { month, year }],
      })
    },
  })

  return mutation
}
