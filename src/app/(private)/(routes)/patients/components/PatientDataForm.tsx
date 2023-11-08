'use client'
import { Input } from '@/components/formField'

import Phone from '@/utils/Phone'
import { useState } from 'react'
import Button from '@/components/Button'
import { Box } from '@/components/Box/Box'
import { tv } from 'tailwind-variants'

const titleStyles = tv({
  base: 'mb-4 text-xl text-main',
})
const sectionStyles = tv({
  base: 'mb-2 space-y-4 p-4',
})

export default function PatientDataForm() {
  const [pone, setPhone] = useState('')
  return (
    <Box className="m-auto max-w-screen-lg p-0">
      <form>
        <section aria-labelledby="personal-data" className={sectionStyles()}>
          <h2 id="personal-data" className={titleStyles()}>
            Dados pessoais
          </h2>
          <Input.Root>
            <Input.Label>Nome</Input.Label>
            <Input.Field autoComplete="off" />
          </Input.Root>
          <Input.Root>
            <Input.Label>Telefone</Input.Label>
            <Input.Field
              type="tel"
              autoComplete="off"
              onChange={(e) => setPhone(Phone.format(e.target.value))}
              value={pone}
            />
          </Input.Root>
          <div className="grid gap-5 sm:grid-cols-2 ">
            <Input.Root>
              <Input.Label>Data de Nascimento</Input.Label>
              <Input.Field type="date" autoComplete="off" />
            </Input.Root>
            <Input.Root>
              <Input.Label>Gênero</Input.Label>
              <Input.Select>
                <Input.Option value="Masculino">Masculino</Input.Option>
                <Input.Option value="Feminino">Feminino</Input.Option>
              </Input.Select>
            </Input.Root>
          </div>
        </section>
        <hr />
        <section className={sectionStyles()}>
          <h2 className={titleStyles()}>Endereço</h2>
          <Input.Root>
            <Input.Label>CEP</Input.Label>
            <Input.Field />
          </Input.Root>
          <div className="grid gap-5 md:grid-cols-2 ">
            <Input.Root>
              <Input.Label>Estado</Input.Label>
              <Input.Field />
            </Input.Root>

            <Input.Root>
              <Input.Label>Cidade</Input.Label>
              <Input.Field />
            </Input.Root>

            <Input.Root>
              <Input.Label>Endereço</Input.Label>
              <Input.Field />
            </Input.Root>
            <Input.Root>
              <Input.Label>Número</Input.Label>
              <Input.Field />
            </Input.Root>
          </div>
        </section>
      </form>
      <div className="sticky bottom-0 flex rounded-b-xl border-t border-slate-300 bg-white px-4 py-3">
        <Button color="green" className="w-40">
          Salvar
        </Button>
      </div>
    </Box>
  )
}
