import { Box } from '@/components/Box/Box'
import Button from '@/components/Button'
import SearchInput from '@/components/SearchInput'
import { Table } from '@/components/table'
import { service } from '@/services/service/serverService'
import Link from 'next/link'

export default async function Services() {
  const { services } = await service.list({})

  const toHoursAndMinutes = (value: number) => {
    console.log(value)
    const hours = Math.floor(value / (60 * 60))
    const minutes = (value % (60 * 60)) / 60

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
            <Table.Row
              clickable
              key={service.id}
              columns={['2fr', '2fr', '1fr']}
            >
              <Table.Cell>{service.name}</Table.Cell>
              <Table.Cell>
                {Intl.NumberFormat('pt-br', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(service.value) || '-'}
              </Table.Cell>
              <Table.Cell>
                {toHoursAndMinutes(service.duration) || '-'}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Root>
      </div>
    )
  }

  return (
    <Box className="w-full max-w-screen-lg">
      <div className="mb-6 grid grid-cols-[1fr_auto] items-center gap-8">
        <SearchInput className="text-base" />
        <Button asChild color="green">
          <Link href="/patients/create">Adicionar</Link>
        </Button>
      </div>
      {generateServiceTable()}
    </Box>
  )
}
