import { Box } from '@/components/Box/Box'
import SearchInput from '@/components/SearchInput'
import { Table } from '@/components/table'
import { service } from '@/services/service/serverService'
import CreateServiceModal from './components/CreateServiceModal'
import UpdateServiceModal from './components/updateServiceModal'

export default async function Services() {
  const { services } = await service.list({})

  const toHoursAndMinutes = (value: number) => {
    const hours = Math.floor(value / (60 * 60))
    const minutes = (value % (60 * 60)) / 60

    if (hours <= 0 && minutes <= 0) return '-'

    return `${hours}h ${minutes}min`
  }

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
    <Box className="w-full max-w-screen-lg">
      <div className="mb-6 grid grid-cols-[1fr_auto] items-center gap-8">
        <SearchInput className="text-base" />
        <CreateServiceModal />
      </div>
      {generateServiceTable()}
    </Box>
  )
}
