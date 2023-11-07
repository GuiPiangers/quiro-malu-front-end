'use client'
import { Input } from '@/components/formField'

import Phone from '@/utils/Phone'
import { useState } from 'react'

export default function PatientDataForm() {
  const [pone, setPhone] = useState('')
  return (
    <form className="space-y-4">
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
          <Input.Field type="date" />
        </Input.Root>

        <Input.Root>
          <Input.Label>Gênero</Input.Label>
          <Input.Select>
            <Input.Option value="Masculino">Masculino</Input.Option>
            <Input.Option value="Feminino">Feminino</Input.Option>
            <Input.Option value="MF">Não definido</Input.Option>
            <Input.Option value="MF2">Não definido</Input.Option>
            <Input.Option value="MF3">Não definido</Input.Option>
            <Input.Option value="MF4">Não definido</Input.Option>
            <Input.Option value="MF5">Não definido</Input.Option>
          </Input.Select>
        </Input.Root>
      </div>
    </form>
  )
}
