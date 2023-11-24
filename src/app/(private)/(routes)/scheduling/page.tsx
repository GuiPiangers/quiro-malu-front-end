import { Box } from '@/components/Box/Box'
import Button from '@/components/Button'
import NoDataFound from '@/components/NoDataFound'
import { AccordionTable } from '@/components/accordionTable'
import { schedulingService } from '@/services/scheduling/serverScheduling'
import Link from 'next/link'

export default async function Scheduling() {
  const { schedules } = await schedulingService.list({ date: '2023-12-22' })

  console.log(schedules)

  const generateTable = () => {
    if (schedules.length > 0) {
      return schedules.map((scheduling) => {
        return (
          <AccordionTable.Item key={scheduling.id}>
            <AccordionTable.Row columns={['1fr', '1fr', '80px']}>
              <AccordionTable.Cell>{scheduling.date}</AccordionTable.Cell>
              <AccordionTable.Cell>{scheduling.service}</AccordionTable.Cell>
              <Button
                asChild
                variant="outline"
                size="small"
                className="justify-self-stretch"
              >
                <Link href={`/patients/${scheduling.id}`}>Fixa</Link>
              </Button>
            </AccordionTable.Row>
            <AccordionTable.Content className="flex justify-between gap-2">
              <div className="space-y-1 text-sm">
                <p>
                  <strong>Nome:</strong> {scheduling.patientId}
                </p>
                <p>
                  <strong>Telefone:</strong> {scheduling.service}
                </p>
                <p>
                  <strong>Telefone:</strong> {scheduling.duration}
                </p>
              </div>
              <div className="flex w-28 flex-col gap-2">
                <Button variant="outline" size="small">
                  Contato
                </Button>
                <Button variant="outline" size="small">
                  Agendar
                </Button>
              </div>
            </AccordionTable.Content>
          </AccordionTable.Item>
        )
      })
    }
    return (
      <NoDataFound
        message={
          <div className="items center mt-4 flex flex-col gap-2">
            <span>Nenhum paciente encontrado</span>
            <Button asChild size="small" variant="outline" color="green">
              <Link href="/patients/create">Cadastrar paciente</Link>
            </Button>
          </div>
        }
      />
    )
  }

  return (
    <div>
      <Box>
        <AccordionTable.Root>{generateTable()}</AccordionTable.Root>
      </Box>
    </div>
  )
}
