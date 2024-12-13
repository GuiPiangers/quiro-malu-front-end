import {
  ServiceListResponse,
  ServiceResponse,
  updateService,
} from '@/services/service/Service'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'

export function useUpdateService() {
  const queryClient = useQueryClient()

  const searchParams = useSearchParams()
  const page = searchParams.get('page') ?? '1'

  const mutation = useMutation({
    mutationFn: async (data: ServiceResponse) => {
      return await updateService(data)
    },
    onMutate: async (updateService) => {
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
          if (!oldQuery) return oldQuery

          const updatedServices = oldQuery.services.map((service) => {
            if (service.id === updateService.id) {
              return {
                ...service,
                ...updateService,
                value: +updateService.value,
              }
            }

            return service
          })

          console.log(oldQuery)

          return { ...oldQuery, services: updatedServices }
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
