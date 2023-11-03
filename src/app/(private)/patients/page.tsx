import { Box } from '@/components/Box/Box'
import Button from '@/components/Button'
import SearchInput from '@/components/SearchInput'
import { AccordionTable } from '@/components/accordionTable'
import { Accordion } from '@/components/accordion'

export default function Home() {
  return (
    <main className="w-full max-w-6xl">
      <Box>
        <div className="mb-6 grid grid-cols-[1fr_auto] items-center gap-8">
          <SearchInput className="text-base" />
          <Button color="green">Cadastrar</Button>
        </div>

        <Accordion.Root>
          <Accordion.Item>
            <Accordion.Trigger>Trigger item</Accordion.Trigger>
            <Accordion.Content>
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
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item>
            <Accordion.Trigger>
              <span>Trigger item</span>
              <span>Trigger item</span>
            </Accordion.Trigger>
            <Accordion.Content>
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
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>

        <AccordionTable.Root>
          <AccordionTable.Item>
            <AccordionTable.Row className="grid-cols-[1fr_1fr_80px_32px]">
              <p>Henrique Santos</p>
              <p>(51) 99999 9999</p>
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
                <div>Contato</div>
                <div>Agendar</div>
              </div>
            </AccordionTable.Content>
          </AccordionTable.Item>
          <AccordionTable.Item>
            <AccordionTable.Row className="grid-cols-[1fr_1fr_80px_32px]">
              <p>(51) 98989 9898</p>
              <p>Guilherme Eduardo</p>
            </AccordionTable.Row>
            <AccordionTable.Content>Ac</AccordionTable.Content>
          </AccordionTable.Item>
        </AccordionTable.Root>
      </Box>
    </main>
  )
}
