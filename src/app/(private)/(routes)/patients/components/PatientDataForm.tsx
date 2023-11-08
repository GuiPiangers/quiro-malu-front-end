'use client'
import { Input } from '@/components/formField'

import Phone from '@/utils/Phone'
import Button from '@/components/Button'
import { Box } from '@/components/Box/Box'
import { tv } from 'tailwind-variants'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { clientPatientService } from '@/services/patient/clientPatientService'
import Cpf from '@/utils/Cpf'

const titleStyles = tv({
  base: 'mb-4 text-xl text-main',
})
const sectionStyles = tv({
  base: 'mb-2 space-y-4 p-4',
})

const createPatientSchema = z.object({
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
  phone: z.string().regex(/^[(][0-9]{2}[)][ ][0-9]{5}[ ][0-9]{4}$/, {
    message: 'Formato de telefone inválido - padrão (DDD) 99999 9999',
  }),
  // dateOfBirth: z.coerce.date().optional(),
  gender: z.string().optional(),
  cpf: z
    .string()
    .regex(/^[0-9]{3}.[0-9]{3}.[0-9]{3}-[0-9]{2}$/)
    .optional(),
  location: z
    .object({
      cep: z
        .string()
        .regex(/^[0-9]{5}-[0-9]{3}$/)
        .optional(),
      state: z.string().min(3).max(120).optional(),
      city: z.string().min(3).max(120).optional(),
      neighborhood: z.string().max(120).min(3).optional(),
      address: z.string().min(3).max(120).optional(),
    })
    .optional(),
})

export type CreatePatientData = z.infer<typeof createPatientSchema>

export default function PatientDataForm() {
  const createPatientForm = useForm<CreatePatientData>({
    resolver: zodResolver(createPatientSchema),
  })

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    register,
    setValue,
  } = createPatientForm

  const createPatient = async (data: CreatePatientData) => {
    await clientPatientService.create(data)
  }

  return (
    <form onSubmit={handleSubmit(createPatient)}>
      <Box className="m-auto max-w-screen-lg p-0">
        <section aria-labelledby="personal-data" className={sectionStyles()}>
          <h2 id="personal-data" className={titleStyles()}>
            Dados pessoais
          </h2>

          <Input.Root>
            <Input.Label>Nome</Input.Label>
            <Input.Field
              autoComplete="off"
              error={!!errors.name}
              {...register('name')}
              disabled={isSubmitting}
            />
            {errors.name && (
              <Input.Message error>{errors.name.message}</Input.Message>
            )}
          </Input.Root>

          <Input.Root>
            <Input.Label>Telefone</Input.Label>
            <Input.Field
              type="tel"
              autoComplete="off"
              error={!!errors.phone}
              {...register('phone')}
              disabled={isSubmitting}
              onChange={(e) => setValue('phone', Phone.format(e.target.value))}
            />
            {errors.phone && (
              <Input.Message error>{errors.phone.message}</Input.Message>
            )}
          </Input.Root>

          <Input.Root>
            <Input.Label>CPF</Input.Label>
            <Input.Field
              autoComplete="off"
              error={!!errors.cpf}
              {...register('cpf')}
              disabled={isSubmitting}
              onChange={(e) => setValue('cpf', Cpf.format(e.target.value))}
            />
            {errors.phone && (
              <Input.Message error>{errors.phone.message}</Input.Message>
            )}
          </Input.Root>

          <div className="grid gap-5 sm:grid-cols-2 ">
            {/* <Input.Root>
              <Input.Label>Data de Nascimento</Input.Label>
              <Input.Field
                type="date"
                autoComplete="off"
                error={!!errors.dateOfBirth}
                {...register('dateOfBirth')}
                disabled={isSubmitting}
              />
              {errors.dateOfBirth && (
                <Input.Message error>
                  {errors.dateOfBirth.message}
                </Input.Message>
              )}
            </Input.Root> */}

            <Input.Root>
              <Input.Label>Gênero</Input.Label>
              <Input.Select>
                <Input.Option value="Masculino">Masculino</Input.Option>
                <Input.Option value="Feminino">Feminino</Input.Option>
              </Input.Select>
              {errors.gender && (
                <Input.Message error>{errors.gender.message}</Input.Message>
              )}
            </Input.Root>
          </div>
        </section>
        <hr />
        <section className={sectionStyles()}>
          <h2 className={titleStyles()}>Endereço</h2>
          <Input.Root>
            <Input.Label>CEP</Input.Label>
            <Input.Field
              error={!!errors.location?.cep}
              {...register('location.cep')}
              disabled={isSubmitting}
            />
            {errors.location?.cep && (
              <Input.Message error>
                {errors.location?.cep.message}
              </Input.Message>
            )}
          </Input.Root>
          <div className="grid gap-5 md:grid-cols-2 ">
            <Input.Root>
              <Input.Label>Estado</Input.Label>
              <Input.Field
                error={!!errors.location?.state}
                {...register('location.state')}
                disabled={isSubmitting}
              />
              {errors.location?.state && (
                <Input.Message error>
                  {errors.location?.state.message}
                </Input.Message>
              )}
            </Input.Root>

            <Input.Root>
              <Input.Label>Cidade</Input.Label>
              <Input.Field
                error={!!errors.location?.city}
                {...register('location.city')}
                disabled={isSubmitting}
              />
              {errors.location?.city && (
                <Input.Message error>
                  {errors.location?.city.message}
                </Input.Message>
              )}
            </Input.Root>

            <Input.Root>
              <Input.Label>Bairro</Input.Label>
              <Input.Field
                error={!!errors.location?.neighborhood}
                {...register('location.neighborhood')}
                disabled={isSubmitting}
              />
              {errors.location?.neighborhood && (
                <Input.Message error>
                  {errors.location?.neighborhood.message}
                </Input.Message>
              )}
            </Input.Root>

            <Input.Root>
              <Input.Label>Endereço</Input.Label>
              <Input.Field
                error={!!errors.location?.address}
                {...register('location.address')}
                disabled={isSubmitting}
              />
              {errors.location?.address && (
                <Input.Message error>
                  {errors.location?.address.message}
                </Input.Message>
              )}
            </Input.Root>
          </div>
        </section>
        <div className="sticky bottom-0 flex rounded-b-xl border-t border-slate-300 bg-white px-4 py-3">
          <Button color="green" className="w-40">
            Salvar
          </Button>
        </div>
      </Box>
    </form>
  )
}
