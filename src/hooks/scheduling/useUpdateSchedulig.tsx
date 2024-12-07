import { clientSchedulingService } from '@/services/scheduling/clientScheduling'
import { SchedulingResponse } from '@/services/scheduling/SchedulingService'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'

export function useCreateLaunch() {
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
      const message = await clientSchedulingService.update(data)
      console.log(message)
    },
    onMutate: async (newScheduling) => {
      await queryClient.cancelQueries({
        queryKey: ['listSchedules', { month, year }],
      })
      const previousLaunches = queryClient.getQueryData<
        Partial<SchedulingResponse>[]
      >(['listSchedules', { month, year }])

      queryClient.setQueryData<Partial<SchedulingResponse>[]>(
        ['listSchedules', { month, year }],
        (oldQuery) => {
          if (oldQuery) return [...oldQuery!, newScheduling]
          return [newScheduling]
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
