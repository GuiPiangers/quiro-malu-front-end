import {
  updateBlockEvent,
  UpdateBlockEvent,
} from '@/services/scheduling/scheduling'
import DateTime from '@/utils/Date'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'

export function useUpdateEvent() {
  const queryClient = useQueryClient()

  const searchParams = useSearchParams()

  const date = searchParams.get('date') || DateTime.getIsoDate(new Date())

  const mutation = useMutation({
    mutationFn: async (data: UpdateBlockEvent) => {
      console.log('Chegou aqui')
      return await updateBlockEvent(data)
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['listSchedules', date],
      })
    },
  })

  return mutation
}
