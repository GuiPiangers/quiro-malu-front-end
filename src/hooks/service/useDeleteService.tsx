import {
  deleteService,
  ServiceResponse,
} from '@/services/service/actions/service'
import { ServiceListResponse } from '@/services/service/Service'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter, useSearchParams } from 'next/navigation'

export function useDeleteService() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const searchParams = useSearchParams()

  const page = searchParams.get('page')

  const mutation = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const response = await deleteService({ id })
      router.refresh()
      return response
    },
    onMutate: async (deleteServiceData) => {
      await queryClient.cancelQueries({
        queryKey: ['listService', page],
      })

      const previousLaunches = queryClient.getQueryData<ServiceResponse[]>([
        'listService',
        page,
      ])

      queryClient.setQueryData<ServiceListResponse>(
        ['listService', page],
        (oldQuery) => {
          if (!oldQuery) return oldQuery

          const deleteService = oldQuery.services.filter(
            (launch) => launch.id !== deleteServiceData.id,
          )

          return { ...oldQuery, service: deleteService }
        },
      )
      return { previousLaunches }
    },

    onError: (_err, newTodo, context) => {
      queryClient.setQueryData(['listService', page], context?.previousLaunches)
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['listService'],
      })
    },
  })

  return mutation
}
