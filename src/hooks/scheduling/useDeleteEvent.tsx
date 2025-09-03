import { deleteBlockEvent } from '@/services/scheduling/scheduling'

import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useDeleteEvent() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (data: { id: string }) => {
      return await deleteBlockEvent(data)
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['listSchedules'],
      })
    },
  })

  return mutation
}
