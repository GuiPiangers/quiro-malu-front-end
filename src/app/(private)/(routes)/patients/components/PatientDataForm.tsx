'use client'
import { Input } from '@/components/formField'

import Phone from '@/utils/Phone'
import { useState } from 'react'
import Button from '@/components/Button'
import { Box } from '@/components/Box/Box'
import { tv } from 'tailwind-variants'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const titleStyles = tv({
  base: 'mb-4 text-xl text-main',
})
const sectionStyles = tv({
  base: 'mb-2 space-y-4 p-4',
})

const createUserSchema = z.object({
  name: z
    .string()
    .min(3)
    .max(120)
    .refine((value) => value.split(' ').length > 1, {
      message: 'Deve ser informado o nome completo (nome e sobrenome)',
    })
    .transform((name) => {
      return name
        .toLocaleLowerCase()
        .trim()
        .split(' ')
        .map((word) => {
          if (word.length <= 3 && word[word.length - 1] !== '.') return word
          return word[0].toLocaleUpperCase().concat(word.substring(1))
        })
        .join(' ')
    }),
  email: z.string().email({
    message: 'Formato de e-mail inválido',
  }),
  phone: z.string().regex(/^[(][0-9]{2}[)][ ][0-9]{5}[ ][0-9]{4}$/, {
    message: 'Formato de telefone inválido - padrão (DDD) 99999 9999',
  }),
  password: z
    .string()
    .min(5, {
      message: 'A senha precisa ter no mínimo 5 caracteres',
    })
    .refine((value) => value.match(/[A-Z]/), {
      message: 'A senha deve conter pelo menos uma letra maiúscula',
    })
    .refine((value) => value.match(/[0-9!"#$%&'(.)*+,/:;<=>?@[\]^_`{|}~-]/), {
      message: 'A senha deve conter pelo menos um número ou carácter especial',
    }),
})

export type CreateUserData = z.infer<typeof createUserSchema>

export default function PatientDataForm() {
  const [pone, setPhone] = useState('')

  const createUserForm = useForm<CreateUserData>({
    resolver: zodResolver(createUserSchema),
  })

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    register,
    setValue,
  } = createUserForm

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
