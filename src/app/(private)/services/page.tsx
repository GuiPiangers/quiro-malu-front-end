import ServiceList from '@/components/serviceList/ServiceList'
import { Validate } from '@/services/api/Validate'
import { listService } from '@/services/service/Service'

export default async function Services({
  searchParams,
}: {
  searchParams: { page?: string; pesquisa?: string }
}) {
  const page =
    searchParams.page && +searchParams.page > 0 ? searchParams.page : '1'
  const search = searchParams.pesquisa ? searchParams.pesquisa : ''

  const res = await listService({ page, search }).then((data) =>
    Validate.isOk(data) ? data : undefined,
  )

  return <ServiceList page={page} defaultData={res} />
}
