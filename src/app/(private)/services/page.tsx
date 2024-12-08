import ServiceList from '@/components/serviceList/ServiceList'
import { Validate } from '@/services/api/Validate'
import { listService } from '@/services/service/actions/service'

export default async function Services({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const page =
    searchParams.page && +searchParams.page > 0 ? searchParams.page : '1'

  const res = await listService({ page }).then((data) =>
    Validate.isOk(data) ? data : undefined,
  )

  return <ServiceList page={page} defaultData={res} />
}
