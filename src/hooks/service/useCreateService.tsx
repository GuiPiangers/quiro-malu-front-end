import {
  createService,
  ServiceListResponse,
  ServiceResponse,
} from '@/services/service/service'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'

export function useCreateService() {
  const queryClient = useQueryClient()

  const searchParams = useSearchParams()
  const page = searchParams.get('page')

  const mutation = useMutation({
    mutationFn: async (data: ServiceResponse) => {
      return await createService(data)
    },
    onMutate: async (newService) => {
      await queryClient.cancelQueries({
        queryKey: ['listServices', page],
      })
      const previousLaunches = queryClient.getQueryData<ServiceListResponse>([
        'listServices',
        page,
      ])

      queryClient.setQueryData<ServiceListResponse>(
        ['listServices', page],
        (oldQuery) => {
          if (oldQuery) {
            return {
              ...oldQuery,
              total: oldQuery.total + 1,
              services: [newService, ...oldQuery.services],
            }
          }
          return { total: 1, limit: 20, services: [newService] }
        },
      )
      return { previousLaunches }
    },

    onError: (_err, newTodo, context) => {
      queryClient.setQueryData(
        ['listServices', page],
        context?.previousLaunches,
      )
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['listServices'],
      })
    },
  })

  return mutation
}
