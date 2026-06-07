'use client'

import Modal, { ModalHandles } from '@/components/modal/Modal'
import { ReactNode, useRef } from 'react'
import RoleForm, { permissionsToRoleEntries, RoleFormData } from './RoleForm'
import HeaderForm from '@/components/modal/HeaderModal'
import Button, { ButtonPropsVariants } from '@/components/Button'
import { useQueryClient } from '@tanstack/react-query'
import { Validate } from '@/services/api/Validate'
import {
  createRole,
  PermissionCatalogItem,
  replaceRolePermissions,
} from '@/services/rbac/rbac'
import { responseError } from '@/services/api/api'

type CreateRoleModalProps = {
  permissionsCatalog: PermissionCatalogItem[]
  className?: string
  children?: ReactNode
} & ButtonPropsVariants

export default function CreateRoleModal({
  permissionsCatalog,
  color,
  children,
  ...props
}: CreateRoleModalProps) {
  const modalRef = useRef<ModalHandles>(null)
  const queryClient = useQueryClient()

  const openModal = () => modalRef.current?.openModal()
  const closeModal = () => modalRef.current?.closeModal()

  const afterSubmit = () => {
    closeModal()
    queryClient.invalidateQueries({ queryKey: ['roles'] })
  }

  const handleCreate = async (
    data: RoleFormData,
  ): Promise<responseError | void> => {
    const created = await createRole({
      name: data.name,
      description: data.description,
    })
    if (Validate.isError(created)) return created

    if (Object.keys(data.permissions).length > 0) {
      const permissionsRes = await replaceRolePermissions(
        created.id,
        permissionsToRoleEntries(data.permissions),
      )
      if (Validate.isError(permissionsRes)) return permissionsRes
    }

    return undefined
  }

  return (
    <>
      <Button color={color || 'green'} {...props} onClick={openModal}>
        {children ?? 'Adicionar'}
      </Button>
      <Modal ref={modalRef} className="m-4 w-full max-w-lg p-0">
        <HeaderForm handleClose={closeModal} title="Nova função" />
        <RoleForm
          permissionsCatalog={permissionsCatalog}
          buttons={<Button color="green">Salvar</Button>}
          className="shadow-none"
          action={handleCreate}
          afterValidation={afterSubmit}
        />
      </Modal>
    </>
  )
}
