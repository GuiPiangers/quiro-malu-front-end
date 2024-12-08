'use client'

import {
  listService,
  ServiceListResponse,
} from '@/services/service/actions/service'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import NoDataFound from '../notFound/NoDataFound'
import { Validate } from '@/services/api/Validate'
import { Table } from '../table'
import UpdateServiceModal from '@/app/(private)/services/components/updateServiceModal'
import { Box } from '../box/Box'
import SearchInput from '../input/SearchInput'
import CreateServiceModal from '@/app/(private)/services/components/CreateServiceModal'
import Pagination from '../pagination/Pagination'
import { NoServicesDataFound } from '../notFound/NoServiceDataFound'

type ServiceListPros = {
  page: string
  defaultData?: ServiceListResponse
}

export default function ServiceList({ page, defaultData }: ServiceListPros) {
  const { data } = useQuery({
    queryKey: ['listServices', page],
    queryFn: async () => {
      const result = await listService({ page })

      return result
    },
    initialData: defaultData,
    placeholderData: keepPreviousData,
  })

  if (Validate.isError(data) || !data) {
    return <NoDataFound />
  }
  const { limit, services, total } = data

  const generateServiceTable = () => {
    return (
      <div>
        <Table.Root>
          <Table.Row columns={['2fr', '2fr', '1fr']}>
            <Table.Head>Nome</Table.Head>
            <Table.Head>Valor</Table.Head>
            <Table.Head>Duração</Table.Head>
          </Table.Row>
          {services.map((service) => (
            <UpdateServiceModal service={service} key={service.id} />
          ))}
        </Table.Root>
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <Box className="w-full max-w-screen-lg">
        <div className="mb-6 grid grid-cols-1 items-center gap-4 sm:grid-cols-[1fr_auto]">
          <SearchInput className="text-base" />
          <CreateServiceModal>Adicionar</CreateServiceModal>
        </div>
        {services.length > 0 ? generateServiceTable() : <NoServicesDataFound />}
      </Box>
      <Pagination page={+page} limit={limit} total={total}></Pagination>
    </div>
  )
}
