'use client'

import { Input } from '@/components/input'
import Form, { FormProps } from '@/components/form/Form'
import { sectionStyles } from '@/components/form/Styles'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import useSnackbarContext from '@/hooks/useSnackbarContext'
import { responseError } from '@/services/api/api'
import { Validate } from '@/services/api/Validate'
import { PermissionCatalogItem } from '@/services/rbac/rbac'
import { Checkbox } from '@/components/ui/checkbox'
import { ACTION_LABELS, MODULE_LABELS } from '../roleLabels'
import { useMemo, useState } from 'react'
import { PermissionScope } from '@/types/permissions'
import { permissionSupportsScope } from '../permissionScope'
import EventsPermissionScopeField from './EventsPermissionScopeField'

const permissionScopeSchema = z.union([
  z.object({ type: z.literal('all') }),
  z.object({ type: z.literal('own') }),
  z.object({
    type: z.literal('list'),
    userIds: z.array(z.string()),
  }),
  z.null(),
])

export const roleFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Campo obrigatório')
    .max(80, 'Máximo de 80 caracteres'),
  description: z
    .string()
    .max(200, 'Máximo de 200 caracteres')
    .optional()
    .or(z.literal('')),
  permissions: z.record(z.string(), permissionScopeSchema),
})

export type RoleFormData = z.infer<typeof roleFormSchema>

type RoleFormProps = {
  action(data: RoleFormData): Promise<responseError | void>
  formData?: Partial<RoleFormData>
  permissionsCatalog: PermissionCatalogItem[]
  readOnly?: boolean
  afterValidation?(): void
} & FormProps

function validatePermissions(
  permissions: Record<string, PermissionScope | null>,
): string | null {
  for (const [permissionKey, scope] of Object.entries(permissions)) {
    if (!permissionSupportsScope(permissionKey)) continue
    if (
      scope?.type === 'list' &&
      (!scope.userIds || scope.userIds.length === 0)
    ) {
      return `Selecione ao menos um profissional para "${permissionKey}".`
    }
  }
  return null
}

export default function RoleForm({
  formData,
  afterValidation,
  action,
  permissionsCatalog,
  readOnly = false,
  ...formProps
}: RoleFormProps) {
  const { handleMessage } = useSnackbarContext()
  const [scopeError, setScopeError] = useState<string | null>(null)

  const roleForm = useForm<RoleFormData>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: formData?.name ?? '',
      description: formData?.description ?? '',
      permissions: formData?.permissions ?? {},
    },
  })

  const {
    handleSubmit,
    formState: { isSubmitting, errors, dirtyFields },
    register,
    reset,
    control,
    watch,
    setValue,
  } = roleForm

  const permissions = watch('permissions')

  const permissionsByModule = useMemo(() => {
    const grouped = new Map<string, PermissionCatalogItem[]>()
    for (const permission of permissionsCatalog) {
      const list = grouped.get(permission.module) ?? []
      list.push(permission)
      grouped.set(permission.module, list)
    }
    return Array.from(grouped.entries()).sort(([a], [b]) =>
      (MODULE_LABELS[a] ?? a).localeCompare(MODULE_LABELS[b] ?? b, 'pt-BR'),
    )
  }, [permissionsCatalog])

  const togglePermission = (key: string, checked: boolean) => {
    const current = { ...permissions }
    if (checked) {
      current[key] = null
      setValue('permissions', current, { shouldDirty: true })
      return
    }
    delete current[key]
    setValue('permissions', current, { shouldDirty: true })
  }

  const updatePermissionScope = (
    key: string,
    scope: PermissionScope | null,
  ) => {
    setScopeError(null)
    setValue(
      'permissions',
      { ...permissions, [key]: scope },
      { shouldDirty: true },
    )
  }

  const onSubmit = async (data: RoleFormData) => {
    const validationMessage = validatePermissions(data.permissions)
    if (validationMessage) {
      setScopeError(validationMessage)
      handleMessage({
        title: 'Escopo inválido',
        description: validationMessage,
        type: 'error',
      })
      return
    }

    const res = await action({
      ...data,
      description: data.description?.trim() || undefined,
    })
    if (Validate.isError(res)) {
      handleMessage({ title: 'Erro!', description: res.message, type: 'error' })
      return
    }
    reset(data, { keepValues: true })
    afterValidation?.()
    handleMessage({
      title: 'Função salva com sucesso!',
      type: 'success',
    })
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      {...formProps}
      className="border-none"
      buttons={readOnly ? undefined : formProps.buttons}
    >
      <section aria-label="Dados da função" className={sectionStyles()}>
        <Input.Root>
          <Input.Label required notSave={dirtyFields.name}>
            Nome
          </Input.Label>
          <Input.Field
            autoComplete="off"
            disabled={isSubmitting || readOnly}
            error={!!errors.name}
            {...register('name')}
            notSave={dirtyFields.name}
          />
          {errors.name && (
            <Input.Message error>{errors.name.message}</Input.Message>
          )}
        </Input.Root>

        <Input.Root>
          <Input.Label notSave={dirtyFields.description}>Descrição</Input.Label>
          <Input.Field
            autoComplete="off"
            disabled={isSubmitting || readOnly}
            error={!!errors.description}
            {...register('description')}
            notSave={dirtyFields.description}
          />
          {errors.description && (
            <Input.Message error>{errors.description.message}</Input.Message>
          )}
        </Input.Root>
      </section>

      <section
        aria-label="Permissões"
        className="max-h-[min(50vh,24rem)] space-y-4 overflow-y-auto px-4 pb-4"
      >
        <h3 className="text-sm font-semibold text-main">Permissões</h3>
        {readOnly && (
          <p className="text-xs text-slate-500">
            Papéis do sistema não podem ter permissões alteradas.
          </p>
        )}
        {scopeError && <p className="text-xs text-red-600">{scopeError}</p>}
        {permissionsByModule.map(([module, modulePermissions]) => (
          <div key={module} className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {MODULE_LABELS[module] ?? module}
            </p>
            <ul className="space-y-2">
              {modulePermissions.map((permission) => {
                const isChecked = permission.key in (permissions ?? {})
                const scopeValue = permissions?.[permission.key] ?? null

                return (
                  <li
                    key={permission.key}
                    className="rounded-md border border-slate-200 px-3 py-2"
                  >
                    <div className="flex items-start gap-3">
                      <Controller
                        name="permissions"
                        control={control}
                        render={() => (
                          <Checkbox
                            id={`perm-${permission.key}`}
                            checked={isChecked}
                            disabled={isSubmitting || readOnly}
                            onCheckedChange={(checked) =>
                              togglePermission(permission.key, checked === true)
                            }
                          />
                        )}
                      />
                      <label
                        htmlFor={`perm-${permission.key}`}
                        className="flex-1 cursor-pointer text-sm"
                      >
                        <span className="font-medium text-slate-800">
                          {permission.description}
                        </span>
                        <span className="mt-0.5 block text-xs text-slate-500">
                          {ACTION_LABELS[permission.action] ??
                            permission.action}{' '}
                          · {permission.key}
                        </span>
                      </label>
                    </div>

                    {isChecked && permissionSupportsScope(permission.key) && (
                      <EventsPermissionScopeField
                        value={scopeValue}
                        disabled={isSubmitting || readOnly}
                        onChange={(scope) =>
                          updatePermissionScope(permission.key, scope)
                        }
                      />
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </section>
    </Form>
  )
}

function permissionsToRoleEntries(
  permissions: Record<string, PermissionScope | null>,
) {
  return Object.entries(permissions).map(([permissionKey, scope]) => ({
    permissionKey,
    scope: permissionSupportsScope(permissionKey) ? scope : null,
  }))
}

export { permissionsToRoleEntries }
