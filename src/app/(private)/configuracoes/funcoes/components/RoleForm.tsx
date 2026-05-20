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
import { useMemo } from 'react'

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
  permissionKeys: z.array(z.string()),
})

export type RoleFormData = z.infer<typeof roleFormSchema>

type RoleFormProps = {
  action(data: RoleFormData): Promise<responseError | void>
  formData?: Partial<RoleFormData>
  permissionsCatalog: PermissionCatalogItem[]
  readOnly?: boolean
  afterValidation?(): void
} & FormProps

export default function RoleForm({
  formData,
  afterValidation,
  action,
  permissionsCatalog,
  readOnly = false,
  ...formProps
}: RoleFormProps) {
  const { handleMessage } = useSnackbarContext()

  const roleForm = useForm<RoleFormData>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: formData?.name ?? '',
      description: formData?.description ?? '',
      permissionKeys: formData?.permissionKeys ?? [],
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

  const permissionKeys = watch('permissionKeys')

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
    const current = permissionKeys ?? []
    if (checked) {
      setValue('permissionKeys', [...current, key], { shouldDirty: true })
      return
    }
    setValue(
      'permissionKeys',
      current.filter((k) => k !== key),
      { shouldDirty: true },
    )
  }

  const onSubmit = async (data: RoleFormData) => {
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
        {permissionsByModule.map(([module, permissions]) => (
          <div key={module} className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {MODULE_LABELS[module] ?? module}
            </p>
            <ul className="space-y-2">
              {permissions.map((permission) => (
                <li
                  key={permission.key}
                  className="flex items-start gap-3 rounded-md border border-slate-200 px-3 py-2"
                >
                  <Controller
                    name="permissionKeys"
                    control={control}
                    render={() => (
                      <Checkbox
                        id={`perm-${permission.key}`}
                        checked={permissionKeys?.includes(permission.key)}
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
                      {ACTION_LABELS[permission.action] ?? permission.action} ·{' '}
                      {permission.key}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </Form>
  )
}
