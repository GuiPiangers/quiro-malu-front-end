import {
  updateScheduling,
  SchedulingResponse,
  SchedulingListResponse,
  EventsResponse,
} from '@/services/scheduling/scheduling'
import DateTime from '@/utils/Date'
import { isSchedulingEvent } from '@/utils/eventValidator'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'

export function useUpdateScheduling() {
  const queryClient = useQueryClient()

  const searchParams = useSearchParams()

  const date = searchParams.get('date') || DateTime.getIsoDate(new Date())

  const mutation = useMutation({
    mutationFn: async (data: Partial<SchedulingResponse>) => {
      return await updateScheduling(data)
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

          const updatedLaunches = oldQuery.data.map((launch) => {
            if (
              launch.id === updateSchedulingData.id &&
              isSchedulingEvent(launch)
            ) {
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
