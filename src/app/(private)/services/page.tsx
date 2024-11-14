import { Box } from '@/components/box/Box'
import SearchInput from '@/components/input/SearchInput'
import { Table } from '@/components/table'
import { service } from '@/services/service/serverService'
import CreateServiceModal from './components/CreateServiceModal'
import UpdateServiceModal from './components/updateServiceModal'
import NoDataFound from '@/components/NoDataFound'
import Pagination from '@/components/pagination/Pagination'
import { Validate } from '@/services/api/Validate'

function NoServicesDataFound() {
  return (
    <NoDataFound
      message={
        <div className="mt-2">
          <span>Nenhum serviço encontrado</span>
          <CreateServiceModal
            className="mt-4 w-full"
            variant="outline"
            size="small"
          >
            Adicionar serviço
          </CreateServiceModal>
        </div>
      }
    />
  )
}

export default async function Services({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  const page =
    searchParams.page && +searchParams.page > 0 ? searchParams.page : '1'
  const res = await service.list({ page })
  if (Validate.isError(res)) {
    return <NoDataFound />
  }
  const { limit, services, total } = res

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
