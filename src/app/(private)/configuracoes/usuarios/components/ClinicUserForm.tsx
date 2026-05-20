'use client'

import { Input } from '@/components/input'
import Form, { FormProps } from '@/components/form/Form'
import { sectionStyles } from '@/components/form/Styles'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import useSnackbarContext from '@/hooks/useSnackbarContext'
import { responseError } from '@/services/api/api'
import { Validate } from '@/services/api/Validate'
import Phone from '@/utils/Phone'
import PasswordInput from '@/app/(authentication)/components/PasswordInput'
import { Role } from '@/services/rbac/rbac'
import { clinicUserFormSchema, ClinicUserFormData } from '../clinicUserSchemas'
import RoleSelect from './RoleSelect'
import ClinicianServicesField from './ClinicianServicesField'
import UserKindSelect from './UserKindSelect'

type ClinicUserFormProps = {
  action(data: ClinicUserFormData): Promise<responseError | void>
  defaultRoles?: Role[]
  afterValidation?(): void
} & FormProps

export default function ClinicUserForm({
  afterValidation,
  action,
  defaultRoles,
  ...formProps
}: ClinicUserFormProps) {
  const { handleMessage } = useSnackbarContext()

  const form = useForm<ClinicUserFormData>({
    resolver: zodResolver(clinicUserFormSchema),
    defaultValues: {
      userKind: 'user',
      name: '',
      email: '',
      phone: '',
      password: '',
      roleId: '',
      serviceIds: [],
    },
  })

  const {
    handleSubmit,
    formState: { isSubmitting, errors, dirtyFields },
    register,
    reset,
    setValue,
    watch,
  } = form

  const userKind = watch('userKind')
  const roleId = watch('roleId')
  const serviceIds = watch('serviceIds')

  const onSubmit = async (data: ClinicUserFormData) => {
    const res = await action(data)
    if (Validate.isError(res)) {
      handleMessage({ title: 'Erro!', description: res.message, type: 'error' })
      return
    }
    reset()
    afterValidation?.()
    handleMessage({
      title: 'Usuário criado com sucesso!',
      type: 'success',
    })
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      {...formProps}
      className="border-none"
    >
      <section aria-label="Tipo e dados do usuário" className={sectionStyles()}>
        <Input.Root>
          <Input.Label required>Tipo de usuário</Input.Label>
          <UserKindSelect
            value={userKind}
            disabled={isSubmitting}
            error={!!errors.userKind}
            onChange={(kind) => {
              setValue('userKind', kind, {
                shouldDirty: true,
                shouldValidate: true,
              })
              if (kind === 'user') {
                setValue('serviceIds', [], { shouldDirty: true })
              }
            }}
          />
          {errors.userKind && (
            <Input.Message error>{errors.userKind.message}</Input.Message>
          )}
        </Input.Root>

        <Input.Root>
          <Input.Label required notSave={dirtyFields.name}>
            Nome
          </Input.Label>
          <Input.Field
            autoComplete="off"
            disabled={isSubmitting}
            error={!!errors.name}
            {...register('name')}
            notSave={dirtyFields.name}
          />
          {errors.name && (
            <Input.Message error>{errors.name.message}</Input.Message>
          )}
        </Input.Root>

        <Input.Root>
          <Input.Label required notSave={dirtyFields.email}>
            E-mail
          </Input.Label>
          <Input.Field
            type="email"
            autoComplete="off"
            disabled={isSubmitting}
            error={!!errors.email}
            {...register('email')}
            notSave={dirtyFields.email}
          />
          {errors.email && (
            <Input.Message error>{errors.email.message}</Input.Message>
          )}
        </Input.Root>

        <Input.Root>
          <Input.Label required notSave={dirtyFields.phone}>
            Telefone
          </Input.Label>
          <Input.Field
            autoComplete="off"
            disabled={isSubmitting}
            error={!!errors.phone}
            placeholder="(51) 99999 9999"
            {...register('phone')}
            notSave={dirtyFields.phone}
            onChange={(e) => setValue('phone', Phone.format(e.target.value))}
          />
          {errors.phone && (
            <Input.Message error>{errors.phone.message}</Input.Message>
          )}
        </Input.Root>

        <PasswordInput
          {...register('password')}
          error={!!errors.password}
          disabled={isSubmitting}
        >
          {errors.password && (
            <Input.Message error>{errors.password.message}</Input.Message>
          )}
        </PasswordInput>

        <Input.Root>
          <Input.Label required>Função</Input.Label>
          <RoleSelect
            value={roleId}
            onChange={(id) =>
              setValue('roleId', id, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            disabled={isSubmitting}
            error={!!errors.roleId}
            defaultRoles={defaultRoles}
          />
          {errors.roleId && (
            <Input.Message error>{errors.roleId.message}</Input.Message>
          )}
        </Input.Root>

        {userKind === 'clinician' && (
          <Input.Root>
            <Input.Label>Serviços vinculados</Input.Label>
            <ClinicianServicesField
              className="max-h-48"
              value={serviceIds}
              onChange={(ids) =>
                setValue('serviceIds', ids, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
              disabled={isSubmitting}
              error={errors.serviceIds?.message}
            />
          </Input.Root>
        )}
      </section>
    </Form>
  )
}
