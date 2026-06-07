'use client'

import Modal, { ModalHandles } from '@/components/modal/Modal'
import { useRef, useState } from 'react'
import RoleForm, { permissionsToRoleEntries, RoleFormData } from './RoleForm'
import HeaderForm from '@/components/modal/HeaderModal'
import { Table } from '@/components/table'
import Button from '@/components/Button'
import {
  listRolePermissions,
  PermissionCatalogItem,
  replaceRolePermissions,
  Role,
  updateRole,
} from '@/services/rbac/rbac'
import { responseError } from '@/services/api/api'
import { Validate } from '@/services/api/Validate'
import DeleteRoleButton from './DeleteRoleButton'
import { useQuery, useQueryClient } from '@tanstack/react-query'

type UpdateRoleModalProps = {
  role: Role
  permissionsCatalog: PermissionCatalogItem[]
}

export default function UpdateRoleModal({
  role,
  permissionsCatalog,
}: UpdateRoleModalProps) {
  const modalRef = useRef<ModalHandles>(null)
  const queryClient = useQueryClient()
  const [formDefaults, setFormDefaults] = useState<Partial<RoleFormData>>()

  const { refetch: refetchRolePermissions, isFetching: isLoadingPermissions } =
    useQuery({
      queryKey: ['rolePermissions', role.id],
      queryFn: async () => {
        const result = await listRolePermissions(role.id)
        if (Validate.isError(result)) {
          throw new Error(result.message)
        }
        return result
      },
      enabled: false,
    })

  const openModal = async () => {
    if (role.isSystem) return
    const { data } = await refetchRolePermissions()
    setFormDefaults({
      name: role.name,
      description: role.description,
      permissions: Object.fromEntries(
        data?.map((entry) => [entry.permissionKey, entry.scope ?? null]) ?? [],
      ),
    })
    modalRef.current?.openModal()
  }

  const closeModal = () => modalRef.current?.closeModal()

  const afterSubmit = () => {
    closeModal()
    queryClient.invalidateQueries({ queryKey: ['roles'] })
  }

  const handleUpdate = async (
    data: RoleFormData,
  ): Promise<responseError | void> => {
    const updateRes = await updateRole({
      id: role.id,
      name: data.name,
      description: data.description,
    })
    if (Validate.isError(updateRes)) return updateRes

    const permissionsRes = await replaceRolePermissions(
      role.id,
      permissionsToRoleEntries(data.permissions),
    )
    if (Validate.isError(permissionsRes)) return permissionsRes

    return undefined
  }

  if (role.isSystem) {
    return (
      <Table.Row columns={['2fr', '2fr', '1fr']}>
        <Table.Cell className="font-medium">{role.name}</Table.Cell>
        <Table.Cell className="text-slate-600">
          {role.description || '—'}
        </Table.Cell>
        <Table.Cell>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
            Sistema
          </span>
        </Table.Cell>
      </Table.Row>
    )
  }

  return (
    <>
      <Table.Row clickable columns={['2fr', '2fr', '1fr']} onClick={openModal}>
        <Table.Cell className="font-medium">{role.name}</Table.Cell>
        <Table.Cell className="text-slate-600">
          {role.description || '—'}
        </Table.Cell>
        <Table.Cell>
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
            Personalizada
          </span>
        </Table.Cell>
      </Table.Row>

      <Modal ref={modalRef} className="m-4 w-full max-w-lg p-0">
        <HeaderForm handleClose={closeModal} title="Editar função" />
        {isLoadingPermissions && !formDefaults ? (
          <p className="px-4 py-8 text-center text-sm text-slate-500">
            Carregando permissões…
          </p>
        ) : (
          <RoleForm
            key={`${role.id}-${Object.keys(
              formDefaults?.permissions ?? {},
            ).join(',')}`}
            formData={formDefaults}
            permissionsCatalog={permissionsCatalog}
            buttons={
              <>
                <Button color="green" type="submit">
                  Salvar
                </Button>
                <DeleteRoleButton
                  roleId={role.id}
                  roleName={role.name}
                  onDeleted={closeModal}
                />
              </>
            }
            className="shadow-none"
            action={handleUpdate}
            afterValidation={afterSubmit}
          />
        )}
      </Modal>
    </>
  )
}
