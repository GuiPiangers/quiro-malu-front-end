'use client'

import { Input } from '@/components/input'

import Phone from '@/utils/Phone'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Cpf from '@/utils/Cpf'
import { PatientResponse } from '@/services/patient/actions/patient'
import Form from '@/components/form/Form'
import { sectionStyles, titleStyles } from '@/components/form/Styles'
import { ChangeEvent, ReactNode } from 'react'
import useSnackbarContext from '@/hooks/useSnackbarContext'
import { Validate } from '@/services/api/Validate'
import { responseError } from '@/services/api/api'
import { validateRegex } from '@/utils/validateRegex'

const validateName = (value: string) => {
  if (value.length > 0) {
    if (value.length < 3) return false
    if (value.length > 120) return false
  }
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
  dateOfBirth: z.string().optional(),
  gender: z.enum(['masculino', 'feminino']).optional(),
  profession: z.string().optional(),
  maritalStatus: z.string().optional(),
  education: z.string().optional(),
  cpf: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (value) return Cpf.validate(value)
        return true
      },
      { message: 'CPF fora do padrão esperado' },
    ),
  location: z
    .object({
      cep: z
        .string()
        .refine(
          (value) => {
            if (value)
              return (
                value.length > 0 && validateRegex(value, /^[0-9]{5}-[0-9]{3}$/)
              )
            return true
          },
          {
            message: 'CEP fora do padrão esperado',
          },
        )
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
  ): Promise<PatientResponse | responseError>
  afterValidate?(): void
  buttons?: ReactNode
  btWrapperClassName?: string
  data?: PatientResponse
}

export default function PatientDataForm({
  action,
  afterValidate,
  buttons,
  btWrapperClassName,
  data,
}: PatientDataForm) {
  const { handleMessage } = useSnackbarContext()

  const createPatientForm = useForm<CreatePatientData>({
    resolver: zodResolver(createPatientSchema),
    values: {
      name: data?.name ?? '',
      phone: data?.phone ?? '',
      cpf: data?.cpf ? data.cpf : undefined,
      gender: data?.gender ? data.gender : undefined,
      education: data?.education ? data.education : undefined,
      profession: data?.profession ? data.profession : undefined,
      maritalStatus: data?.maritalStatus ? data.maritalStatus : undefined,
      location: {
        cep: data?.location?.cep ? data.location.cep : undefined,
        state: data?.location?.state ? data.location.state : undefined,
        city: data?.location?.city ? data.location.city : undefined,
        neighborhood: data?.location?.neighborhood
          ? data.location.neighborhood
          : undefined,
        address: data?.location?.address ? data.location.address : undefined,
      },
    },
  })

  const {
    handleSubmit,
    formState: { isSubmitting, errors, dirtyFields },
    register,
    setValue,
    getValues,
    setError,
    reset,
  } = createPatientForm

  const resetForm = (data: CreatePatientData) => {
    reset({ ...data }, { keepValues: true })
  }

  const handleAction = async (data: CreatePatientData) => {
    const res = await action(data)
    if (Validate.isError(res)) {
      if (res.type === 'date') {
        setError('dateOfBirth', { message: res.message })
      } else
        setError(res.type as keyof CreatePatientData, { message: res.message })
    } else {
      if (Validate.isError(res)) {
        handleMessage({
          title: 'Erro!',
          description: res.message,
          type: 'error',
        })
      } else {
        resetForm(data)
        if (afterValidate) afterValidate()
      }
    }
  }

  return (
    <Form
      onSubmit={handleSubmit(handleAction)}
      buttons={buttons}
      btWrapperClassName={btWrapperClassName}
    >
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
          <Input.Label required notSave={dirtyFields.phone}>
            Telefone
          </Input.Label>
          <Input.Field
            type="tel"
            autoComplete="off"
            error={!!errors.phone}
            {...register('phone', {
              onChange: (e: ChangeEvent<HTMLInputElement>) => {
                e.target.value = Phone.format(e.target.value)
              },
            })}
            disabled={isSubmitting}
            defaultValue={data?.phone}
            notSave={dirtyFields.phone}
            inputMode="tel"
          />
          {errors.phone && (
            <Input.Message error>{errors.phone.message}</Input.Message>
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
            <Input.Label notSave={dirtyFields.gender}>Gênero</Input.Label>
            <Input.Select
              onChange={(_, newValue) => {
                setValue('gender', newValue as 'masculino' | 'feminino', {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }}
              slotProps={{
                popper: { className: 'z-40' },
              }}
              disabled={isSubmitting}
              error={!!errors.gender}
              defaultValue={data?.gender}
              value={getValues('gender')}
              notSave={dirtyFields.gender}
            >
              <Input.Option value="masculino">Masculino</Input.Option>
              <Input.Option value="feminino">Feminino</Input.Option>
            </Input.Select>
            {errors.gender && (
              <Input.Message error>{errors.gender.message}</Input.Message>
            )}
          </Input.Root>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Input.Root>
            <Input.Label notSave={dirtyFields.cpf}>CPF</Input.Label>
            <Input.Field
              autoComplete="off"
              error={!!errors.cpf}
              {...register('cpf', {
                onChange: (e: ChangeEvent<HTMLInputElement>) => {
                  e.target.value = Cpf.format(e.target.value)
                },
              })}
              disabled={isSubmitting}
              inputMode="numeric"
              defaultValue={data?.cpf}
              notSave={dirtyFields.cpf}
            />
            {errors.cpf && (
              <Input.Message error>{errors.cpf.message}</Input.Message>
            )}
          </Input.Root>

          <Input.Root>
            <Input.Label notSave={dirtyFields.maritalStatus}>
              Estado civil
            </Input.Label>
            <Input.Select
              onChange={(_, newValue) => {
                setValue('maritalStatus', newValue as string, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }}
              slotProps={{
                popper: { className: 'z-40' },
              }}
              disabled={isSubmitting}
              error={!!errors.maritalStatus}
              defaultValue={data?.maritalStatus}
              value={getValues('maritalStatus')}
              notSave={dirtyFields.maritalStatus}
            >
              <Input.Option value="casado">Casado</Input.Option>
              <Input.Option value="solteiro">Solteiro</Input.Option>
              <Input.Option value="divorciado">Divorciado</Input.Option>
              <Input.Option value="viuvo">Viúvo</Input.Option>
            </Input.Select>

            {errors.maritalStatus && (
              <Input.Message error>
                {errors.maritalStatus.message}
              </Input.Message>
            )}
          </Input.Root>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Input.Root>
            <Input.Label notSave={dirtyFields.profession}>
              Profissão
            </Input.Label>
            <Input.Field
              autoComplete="off"
              error={!!errors.profession}
              {...register('profession')}
              disabled={isSubmitting}
              defaultValue={data?.profession}
              notSave={dirtyFields.profession}
            />
            {errors.profession && (
              <Input.Message error>{errors.profession.message}</Input.Message>
            )}
          </Input.Root>

          <Input.Root>
            <Input.Label notSave={dirtyFields.education}>
              Escolaridade
            </Input.Label>
            <Input.Select
              onChange={(_, newValue) => {
                setValue('education', newValue as string, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }}
              slotProps={{
                popper: { className: 'z-40' },
              }}
              disabled={isSubmitting}
              error={!!errors.education}
              defaultValue={data?.education}
              value={getValues('education')}
              notSave={dirtyFields.education}
            >
              <Input.Option value="fundamental incompleto">
                Fundamental incompleto
              </Input.Option>
              <Input.Option value="fundamental completo">
                Fundamental completo
              </Input.Option>
              <Input.Option value="medio incompleto">
                Médio incompleto
              </Input.Option>
              <Input.Option value="medio completo">Médio completo</Input.Option>
              <Input.Option value="superior incompleto">
                Superior incompleto
              </Input.Option>
              <Input.Option value="superior completo">
                Superior completo
              </Input.Option>
            </Input.Select>

            {errors.education && (
              <Input.Message error>{errors.education.message}</Input.Message>
            )}
          </Input.Root>
        </div>
      </section>
      <hr />
      <section className={sectionStyles()}>
        <h2 className={titleStyles()}>Endereço</h2>
        <Input.Root>
          <Input.Label notSave={dirtyFields.location?.cep}>CEP</Input.Label>
          <Input.Field
            error={!!errors.location?.cep}
            {...register('location.cep')}
            disabled={isSubmitting}
            defaultValue={data?.location?.cep}
            notSave={dirtyFields.location?.cep}
            inputMode="numeric"
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
