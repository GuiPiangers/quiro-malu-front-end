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
  const search = searchParams.get('pesquisa') ?? ''

  const mutation = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const response = await deleteService({ id })
      router.refresh()
      return response
    },
    onMutate: async (deleteServiceData) => {
      await queryClient.cancelQueries({
        queryKey: ['listServices', { page, search }],
      })

      const previousLaunches = queryClient.getQueryData<ServiceResponse[]>([
        'listServices',
        page,
      ])

      queryClient.setQueryData<ServiceListResponse>(
        ['listServices', { page, search }],
        (oldQuery) => {
          if (!oldQuery) return oldQuery

          const deleteService = oldQuery.services.filter(
            (launch) => launch.id !== deleteServiceData.id,
          )

          const services = { ...oldQuery, services: deleteService }
          return services
        },
      )
      return { previousLaunches }
    },

    onError: (_err, newTodo, context) => {
      queryClient.setQueryData(
        ['listServices', { page, search }],
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
