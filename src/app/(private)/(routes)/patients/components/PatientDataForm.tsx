'use client'
import { Input } from '@/components/formField'

import Phone from '@/utils/Phone'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Cpf from '@/utils/Cpf'
import { PatientResponse } from '@/services/patient/PatientService'
import Form from './Form'
import { sectionStyles, titleStyles } from './Styles'

const validateName = (value: string) => {
  if (value.length > 0) {
    if (value.length < 3) return false
    if (value.length > 120) return false
  }
  return true
}
const validateRegex = (value: string, pattern: RegExp) => {
  if (value.length > 0) return pattern.test(value)
  return true
}

const createPatientSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'O nome deve conter no mínimo 3 caracteres' })
    .max(120, { message: 'O nome deve conter no máximo 120 caracteres' })
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
  dateOfBirth: z.string(),
  gender: z.string().optional(),
  cpf: z
    .string()
    .refine(
      (value) => validateRegex(value, /^[0-9]{3}.[0-9]{3}.[0-9]{3}-[0-9]{2}$/),
      { message: 'CPF fora do padrão esperado' },
    ),
  location: z
    .object({
      cep: z
        .string()
        .refine((value) => validateRegex(value, /^[0-9]{5}-[0-9]{3}$/), {
          message: 'CEP fora do padrão esperado',
        })
        .optional(),
      state: z
        .string()
        .refine(validateName, {
          message:
            'O estado deve conter no mínimo 3 carácteres e no máximo 120',
        })
        .optional(),
      city: z
        .string()
        .refine(validateName, {
          message:
            'A cidade deve conter no mínimo 3 carácteres e no máximo 120',
        })
        .optional(),
      neighborhood: z
        .string()
        .refine(validateName, {
          message:
            'O bairro deve conter no mínimo 3 carácteres e no máximo 120',
        })
        .optional(),
      address: z
        .string()
        .refine(validateName, {
          message:
            'O Endereço deve conter no mínimo 3 carácteres e no máximo 120',
        })
        .optional(),
    })
    .optional(),
})

export type CreatePatientData = z.infer<typeof createPatientSchema>
type PatientDataForm = {
  action(data: CreatePatientData | PatientResponse): void
  data?: PatientResponse
}

export default function PatientDataForm({ action, data }: PatientDataForm) {
  const createPatientForm = useForm<CreatePatientData>({
    resolver: zodResolver(createPatientSchema),
  })

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    register,
    setValue,
  } = createPatientForm
  return (
    <Form onSubmit={handleSubmit(action)}>
      <section aria-labelledby="personal-data" className={sectionStyles()}>
        <h2 id="personal-data" className={titleStyles()}>
          Dados pessoais
        </h2>

        <Input.Root>
          <Input.Label required>Nome</Input.Label>
          <Input.Field
            autoComplete="off"
            error={!!errors.name}
            {...register('name')}
            disabled={isSubmitting}
            defaultValue={data?.name}
          />
          {errors.name && (
            <Input.Message error>{errors.name.message}</Input.Message>
          )}
        </Input.Root>

        <Input.Root>
          <Input.Label required>Telefone</Input.Label>
          <Input.Field
            type="tel"
            autoComplete="off"
            error={!!errors.phone}
            {...register('phone')}
            disabled={isSubmitting}
            onChange={(e) => setValue('phone', Phone.format(e.target.value))}
            defaultValue={data?.phone}
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
            defaultValue={data?.cpf}
          />
          {errors.cpf && (
            <Input.Message error>{errors.cpf.message}</Input.Message>
          )}
        </Input.Root>

        <div className="grid gap-5 sm:grid-cols-2 ">
          <Input.Root>
            <Input.Label>Data de Nascimento</Input.Label>
            <Input.Field
              type="date"
              autoComplete="off"
              error={!!errors.dateOfBirth}
              {...register('dateOfBirth')}
              disabled={isSubmitting}
              defaultValue={data?.dateOfBirth?.substring(0, 10)}
            />
            {errors.dateOfBirth && (
              <Input.Message error>{errors.dateOfBirth.message}</Input.Message>
            )}
          </Input.Root>

          <Input.Root>
            <Input.Label>Gênero</Input.Label>
            <Input.Select
              {...register('gender')}
              onChange={(_, newValue) => setValue('gender', newValue as string)}
              disabled={isSubmitting}
              error={!!errors.gender}
              defaultValue={data?.gender}
            >
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
            defaultValue={data?.location?.cep}
          />
          {errors.location?.cep && (
            <Input.Message error>{errors.location?.cep.message}</Input.Message>
          )}
        </Input.Root>
        <div className="grid gap-5 md:grid-cols-2 ">
          <Input.Root>
            <Input.Label>Estado</Input.Label>
            <Input.Field
              error={!!errors.location?.state}
              {...register('location.state')}
              disabled={isSubmitting}
              defaultValue={data?.location?.state}
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
              defaultValue={data?.location?.city}
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
              defaultValue={data?.location?.neighborhood}
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
              defaultValue={data?.location?.address}
            />
            {errors.location?.address && (
              <Input.Message error>
                {errors.location?.address.message}
              </Input.Message>
            )}
          </Input.Root>
        </div>
      </section>
    </Form>
  )
}
