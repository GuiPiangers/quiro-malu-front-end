import {
  deleteService,
  ServiceResponse,
  ServiceListResponse,
} from '@/services/service/Service'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'

export function useDeleteService() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const searchParams = useSearchParams()

  const page = searchParams.get('page') ?? '1'

  const mutation = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const response = await deleteService({ id })
      router.refresh()
      return response
    },
    onMutate: async (deleteServiceData) => {
      await queryClient.cancelQueries({
        queryKey: ['listServices', page],
      })

      const previousLaunches = queryClient.getQueryData<ServiceResponse[]>([
        'listServices',
        page,
      ])

      queryClient.setQueryData<ServiceListResponse>(
        ['listServices', page],
        (oldQuery) => {
          if (!oldQuery) return oldQuery

          const deleteService = oldQuery.services.filter(
            (launch) => launch.id !== deleteServiceData.id,
          )

          console.log(deleteService)

          const services = { ...oldQuery, services: deleteService }
          console.log(services)

          return services
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
