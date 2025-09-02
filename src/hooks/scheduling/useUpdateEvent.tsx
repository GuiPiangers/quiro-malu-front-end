import {
  updateBlockEvent,
  UpdateBlockEvent,
} from '@/services/scheduling/scheduling'

import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useUpdateEvent() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (data: UpdateBlockEvent) => {
      console.log('Chegou aqui')
      return await updateBlockEvent(data)
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['listSchedules'],
      })
    },
  })

  return mutation
}
