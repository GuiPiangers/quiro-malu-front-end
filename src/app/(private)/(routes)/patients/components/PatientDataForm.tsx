'use client'
import { Input } from '@/components/input'

import Phone from '@/utils/Phone'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Cpf from '@/utils/Cpf'
import { PatientResponse } from '@/services/patient/PatientService'
import Form from '../../../../../components/form/Form'
import {
  sectionStyles,
  titleStyles,
} from '../../../../../components/form/Styles'
import { responseError } from '@/services/api/api'
import { useState } from 'react'
import useSnackbarContext from '@/hooks/useSnackbarContext copy'

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

export const createPatientSchema = z.object({
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
  action(
    data: CreatePatientData | PatientResponse,
  ): Promise<PatientResponse & responseError>
  afterValidate?(): void
  data?: PatientResponse
}

export default function PatientDataForm({
  action,
  afterValidate,
  data,
}: PatientDataForm) {
  const { handleMessage } = useSnackbarContext()

  const [phoneNotSave, setPhoneNotSave] = useState(false)
  const [cpfNotSave, setCpfNotSave] = useState(false)
  const [genderNotSave, setGenderNotSave] = useState(false)
  const [cepNotSave, setCepNotSave] = useState(false)

  const createPatientForm = useForm<CreatePatientData>({
    resolver: zodResolver(createPatientSchema),
  })

  const {
    handleSubmit,
    formState: { isSubmitting, errors, dirtyFields },
    register,
    setValue,
    setError,
    reset,
  } = createPatientForm

  const resetForm = (data: CreatePatientData) => {
    reset({ ...data })
    setCepNotSave(false)
    setCpfNotSave(false)
    setPhoneNotSave(false)
    setGenderNotSave(false)
  }

  const handleAction = async (data: CreatePatientData) => {
    const res = await action(data)
    if (res.type) {
      if (res.type === 'date') {
        setError('dateOfBirth', { message: res.message })
      } else
        setError(
          res.type as
            | 'name'
            | 'phone'
            | 'gender'
            | 'cpf'
            | 'location'
            | 'location.cep'
            | 'location.state'
            | 'location.city'
            | 'location.neighborhood'
            | 'location.address',
          { message: res.message },
        )
    } else {
      if (res.error) {
        handleMessage({
          title: 'Erro!',
          description: res.message,
          type: 'error',
        })
      } else {
        resetForm(data)
        if (afterValidate) afterValidate()
        handleMessage({
          title: 'Paciente salvo com sucesso!',
          type: 'success',
        })
      }
    }
  }

  return (
    <Form onSubmit={handleSubmit(handleAction)}>
      <section aria-labelledby="personal-data" className={sectionStyles()}>
        <h2 id="personal-data" className={titleStyles()}>
          Dados pessoais
        </h2>

        <Input.Root>
          <Input.Label required notSave={dirtyFields.name}>
            Nome
          </Input.Label>
          <Input.Field
            autoComplete="off"
            error={!!errors.name}
            {...register('name')}
            disabled={isSubmitting}
            defaultValue={data?.name}
            notSave={dirtyFields.name}
          />
          {errors.name && (
            <Input.Message error>{errors.name.message}</Input.Message>
          )}
        </Input.Root>

        <Input.Root>
          <Input.Label required notSave={phoneNotSave}>
            Telefone
          </Input.Label>
          <Input.Field
            type="tel"
            autoComplete="off"
            error={!!errors.phone}
            {...register('phone')}
            disabled={isSubmitting}
            onChange={(e) => {
              setValue('phone', Phone.format(e.target.value))
              setPhoneNotSave(true)
            }}
            defaultValue={data?.phone}
            notSave={phoneNotSave}
          />
          {errors.phone && (
            <Input.Message error>{errors.phone.message}</Input.Message>
          )}
        </Input.Root>

        <Input.Root>
          <Input.Label notSave={cpfNotSave}>CPF</Input.Label>
          <Input.Field
            autoComplete="off"
            error={!!errors.cpf}
            {...register('cpf')}
            disabled={isSubmitting}
            onChange={(e) => {
              setValue('cpf', Cpf.format(e.target.value))
              setCpfNotSave(true)
            }}
            defaultValue={data?.cpf}
            notSave={cpfNotSave}
          />
          {errors.cpf && (
            <Input.Message error>{errors.cpf.message}</Input.Message>
          )}
        </Input.Root>

        <div className="grid gap-5 sm:grid-cols-2 ">
          <Input.Root>
            <Input.Label notSave={dirtyFields.dateOfBirth}>
              Data de Nascimento
            </Input.Label>
            <Input.Field
              type="date"
              autoComplete="off"
              error={!!errors.dateOfBirth}
              {...register('dateOfBirth')}
              disabled={isSubmitting}
              defaultValue={data?.dateOfBirth?.substring(0, 10)}
              notSave={dirtyFields.dateOfBirth}
            />
            {errors.dateOfBirth && (
              <Input.Message error>{errors.dateOfBirth.message}</Input.Message>
            )}
          </Input.Root>

          <Input.Root>
            <Input.Label notSave={genderNotSave}>Gênero</Input.Label>
            <Input.Select
              {...register('gender')}
              onChange={(_, newValue) => {
                setValue('gender', newValue as string)
                setGenderNotSave(true)
              }}
              disabled={isSubmitting}
              error={!!errors.gender}
              defaultValue={data?.gender}
              notSave={genderNotSave}
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
          <Input.Label notSave={cepNotSave}>CEP</Input.Label>
          <Input.Field
            error={!!errors.location?.cep}
            {...register('location.cep')}
            disabled={isSubmitting}
            defaultValue={data?.location?.cep}
            notSave={cepNotSave}
            onChange={(e) => setCepNotSave(true)}
          />
          {errors.location?.cep && (
            <Input.Message error>{errors.location?.cep.message}</Input.Message>
          )}
        </Input.Root>
        <div className="grid gap-5 md:grid-cols-2 ">
          <Input.Root>
            <Input.Label notSave={dirtyFields.location?.state}>
              Estado
            </Input.Label>
            <Input.Field
              error={!!errors.location?.state}
              {...register('location.state')}
              disabled={isSubmitting}
              defaultValue={data?.location?.state}
              notSave={dirtyFields.location?.state}
            />
            {errors.location?.state && (
              <Input.Message error>
                {errors.location?.state.message}
              </Input.Message>
            )}
          </Input.Root>

          <Input.Root>
            <Input.Label notSave={dirtyFields.location?.city}>
              Cidade
            </Input.Label>
            <Input.Field
              error={!!errors.location?.city}
              {...register('location.city')}
              disabled={isSubmitting}
              defaultValue={data?.location?.city}
              notSave={dirtyFields.location?.city}
            />
            {errors.location?.city && (
              <Input.Message error>
                {errors.location?.city.message}
              </Input.Message>
            )}
          </Input.Root>

          <Input.Root>
            <Input.Label notSave={dirtyFields.location?.neighborhood}>
              Bairro
            </Input.Label>
            <Input.Field
              error={!!errors.location?.neighborhood}
              {...register('location.neighborhood')}
              disabled={isSubmitting}
              defaultValue={data?.location?.neighborhood}
              notSave={dirtyFields.location?.neighborhood}
            />
            {errors.location?.neighborhood && (
              <Input.Message error>
                {errors.location?.neighborhood.message}
              </Input.Message>
            )}
          </Input.Root>

          <Input.Root>
            <Input.Label notSave={dirtyFields.location?.address}>
              Endereço
            </Input.Label>
            <Input.Field
              error={!!errors.location?.address}
              {...register('location.address')}
              disabled={isSubmitting}
              defaultValue={data?.location?.address}
              notSave={dirtyFields.location?.address}
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
