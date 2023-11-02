import { Box } from '@/components/Box/Box'
import Button from '@/components/Button'
import SearchInput from '@/components/SearchInput'
import { AccordionTable } from '@/components/accordionTable'

export default function Home() {
  return (
    <main className="w-full max-w-6xl">
      <Box>
        <div className="mb-6 grid grid-cols-[1fr_auto] items-center gap-8">
          <SearchInput className="text-base" />
          <Button color="green">Cadastrar</Button>
        </div>
        <AccordionTable.Root columns={['1fr', '1fr', '80px']}>
          <AccordionTable.Item value="item 1">
            <AccordionTable.Row>
              <p>Henrique Santos</p>
              <p>(51) 99999 9999</p>
              <Button variant="outline" size="small">
                Ficha
              </Button>
            </AccordionTable.Row>
            <AccordionTable.Content className="flex justify-between gap-2">
              <div className="space-y-1 text-sm">
                <p>
                  <strong>Nome:</strong> Henrique Santos
                </p>
                <p>
                  <strong>Telefone:</strong> (51) 99999 9999
                </p>
                <p>
                  <strong>Idade:</strong> 21
                </p>
                <p>
                  <strong>Cidade:</strong> Sapiranga
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
          <AccordionTable.Item value="item 2">
            <AccordionTable.Row>
              <p>Guilherme Eduardo</p>
              <p>(51) 98989 9898</p>
              <Button variant="outline" size="small">
                Ficha
              </Button>
            </AccordionTable.Row>
            <AccordionTable.Content>Ac</AccordionTable.Content>
          </AccordionTable.Item>
        </AccordionTable.Root>
      </Box>
    </main>
  )
}
