'use client'

import { Box } from '@/components/box/Box'
import Button from '@/components/Button'
import Form from '@/components/form/Form'
import { Input } from '@/components/input'
import {
  patchUserRole,
  setClinicianServices,
  UserDetail as UserDetailType,
} from '@/services/user/user'
import { Role } from '@/services/rbac/rbac'
import { Validate } from '@/services/api/Validate'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import useSnackbarContext from '@/hooks/useSnackbarContext'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import DeleteUserButton from './DeleteUserButton'
import RoleSelect from './RoleSelect'
import ClinicianServicesField from './ClinicianServicesField'
import { userEditSchema, UserEditFormData } from '../userEditSchemas'
import { Time } from '@/utils/Time'

type UserDetailProps = {
  detail: UserDetailType
  defaultRoles: Role[]
}

function getDefaultFormValues(detail: UserDetailType): UserEditFormData {
  return {
    roleId: detail.roleId ?? '',
    serviceIds:
      detail.kind === 'clinician' ? detail.services.map((s) => s.id) : [],
  }
}

export default function UserDetail({ detail, defaultRoles }: UserDetailProps) {
  const displayKind = detail.kind === 'clinician' ? 'Clínico' : 'Usuário'
  const { handleMessage } = useSnackbarContext()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)

  const defaultFormValues = useMemo(
    () => getDefaultFormValues(detail),
    [detail],
  )

  const roleName = useMemo(() => {
    if (!detail.roleId) return 'Sem função'
    return defaultRoles.find((role) => role.id === detail.roleId)?.name ?? '—'
  }, [defaultRoles, detail.roleId])

  const statusDetails = useMemo(() => {
    const config = {
      active: {
        label: 'Ativo',
        className:
          'rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 inline-block',
      },
      inactive: {
        label: 'Inativo',
        className:
          'rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 inline-block',
      },
      pending: {
        label: 'Pendente',
        className:
          'rounded-full bg-yellow-50 px-2 py-0.5 text-xs font-medium text-yellow-800 inline-block',
      },
    }
    return (
      config[detail.status] || {
        label: detail.status,
        className:
          'rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 inline-block',
      }
    )
  }, [detail.status])

  const {
    handleSubmit,
    formState: { isSubmitting, errors, dirtyFields },
    setValue,
    watch,
    reset,
  } = useForm<UserEditFormData>({
    resolver: zodResolver(userEditSchema),
    defaultValues: defaultFormValues,
  })

  const roleId = watch('roleId')
  const serviceIds = watch('serviceIds')

  const startEditing = () => {
    reset(defaultFormValues)
    setIsEditing(true)
  }

  const cancelEditing = () => {
    reset(defaultFormValues)
    setIsEditing(false)
  }

  const onSubmit = async (data: UserEditFormData) => {
    const roleChanged = data.roleId !== (detail.roleId ?? '')
    const servicesChanged =
      detail.kind === 'clinician' &&
      (data.serviceIds.length !== defaultFormValues.serviceIds.length ||
        data.serviceIds.some(
          (id) => !defaultFormValues.serviceIds.includes(id),
        ))

    if (!roleChanged && !servicesChanged) {
      handleMessage({
        title: 'Nenhuma alteração para salvar.',
        type: 'success',
      })
      setIsEditing(false)
      return
    }

    if (roleChanged) {
      const roleRes = await patchUserRole({
        id: detail.id,
        roleId: data.roleId,
      })
      if (Validate.isError(roleRes)) {
        handleMessage({
          title: 'Erro!',
          description: roleRes.message,
          type: 'error',
        })
        return
      }
    }

    if (detail.kind === 'clinician' && servicesChanged) {
      const servicesRes = await setClinicianServices({
        id: detail.id,
        services: data.serviceIds.map((serviceId) => ({ serviceId })),
      })
      if (Validate.isError(servicesRes)) {
        handleMessage({
          title: 'Erro!',
          description: servicesRes.message,
          type: 'error',
        })
        return
      }
    }

    await queryClient.invalidateQueries({ queryKey: ['clinicUsers'] })
    await queryClient.invalidateQueries({ queryKey: ['clinicians'] })
    await queryClient.invalidateQueries({ queryKey: ['clinicUser', detail.id] })
    router.refresh()
    setIsEditing(false)
    handleMessage({
      title: 'Usuário atualizado com sucesso!',
      type: 'success',
    })
  }

  const actionButtons = (
    <div className="flex w-full flex-wrap justify-start gap-4">
      {isEditing ? (
        <>
          <Button color="green" type="submit" disabled={isSubmitting}>
            Salvar
          </Button>
          <Button
            type="button"
            variant="outline"
            color="black"
            disabled={isSubmitting}
            onClick={cancelEditing}
          >
            Cancelar
          </Button>
        </>
      ) : (
        <>
          <Button type="button" color="green" onClick={startEditing}>
            Editar
          </Button>
          <DeleteUserButton
            userId={detail.id}
            userName={detail.name}
            redirectTo="/configuracoes/usuarios"
          />
        </>
      )}
    </div>
  )

  if (!isEditing) {
    return (
      <div className="flex w-full max-w-screen-lg flex-col gap-4">
        <Box className="space-y-6">
          <dl className="grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase text-slate-500">
                Nome
              </dt>
              <dd className="mt-0.5 font-medium text-slate-800">
                {detail.name}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase text-slate-500">
                Tipo
              </dt>
              <dd className="mt-0.5">{displayKind}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase text-slate-500">
                E-mail
              </dt>
              <dd className="mt-0.5">{detail.email}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase text-slate-500">
                Telefone
              </dt>
              <dd className="mt-0.5">{detail.phone}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase text-slate-500">
                Função
              </dt>
              <dd className="mt-0.5">{roleName}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase text-slate-500">
                Status
              </dt>
              <dd className="mt-0.5">
                <span className={statusDetails.className}>
                  {statusDetails.label}
                </span>
              </dd>
            </div>
          </dl>

          {detail.kind === 'clinician' && (
            <div>
              <h2 className="mb-3 text-sm font-semibold text-main">
                Serviços vinculados
              </h2>
              {detail.services.length > 0 ? (
                <ul className="space-y-2">
                  {detail.services.map((service) => (
                    <li
                      key={service.id}
                      className="rounded-md border border-slate-200 px-3 py-2 text-sm"
                    >
                      <span className="font-medium">{service.name}</span>
                      <span className="mt-0.5 block text-xs text-slate-500">
                        {Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(service.value)}{' '}
                        · {new Time(service.duration).getHoursAndMinutes()}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-500">
                  Nenhum serviço vinculado.
                </p>
              )}
            </div>
          )}

          <div className="flex justify-start border-t border-slate-200 pt-4">
            {actionButtons}
          </div>
        </Box>
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100svh-12rem)] w-full max-w-screen-lg flex-1 flex-col">
      <Form
        onSubmit={handleSubmit(onSubmit)}
        className="flex min-h-0 flex-1 flex-col border-none shadow-none"
        btWrapperClassName="justify-start"
        buttons={actionButtons}
      >
        <div className="flex min-h-0 flex-1 flex-col space-y-6">
          <dl className="grid shrink-0 gap-4 px-4 pt-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase text-slate-500">
                Nome
              </dt>
              <dd className="mt-0.5 font-medium text-slate-800">
                {detail.name}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase text-slate-500">
                Tipo
              </dt>
              <dd className="mt-0.5">{displayKind}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase text-slate-500">
                E-mail
              </dt>
              <dd className="mt-0.5">{detail.email}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase text-slate-500">
                Telefone
              </dt>
              <dd className="mt-0.5">{detail.phone}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase text-slate-500">
                Status
              </dt>
              <dd className="mt-0.5">
                <span className={statusDetails.className}>
                  {statusDetails.label}
                </span>
              </dd>
            </div>
          </dl>

          <div className="flex min-h-0 flex-1 flex-col space-y-4 px-4 pb-4">
            <Input.Root className="shrink-0">
              <Input.Label required notSave={dirtyFields.roleId}>
                Função
              </Input.Label>
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

            {detail.kind === 'clinician' && (
              <Input.Root className="flex min-h-0 flex-1 flex-col gap-2">
                <Input.Label className="shrink-0">
                  Serviços vinculados
                </Input.Label>
                <ClinicianServicesField
                  className="min-h-0 flex-1"
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
          </div>
        </div>
      </Form>
    </div>
  )
}
