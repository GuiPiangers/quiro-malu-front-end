'use client'

import Modal, { ModalHandles } from '@/components/modal/Modal'
import { ReactNode, useRef } from 'react'
import HeaderForm from '@/components/modal/HeaderModal'
import Button, { ButtonPropsVariants } from '@/components/Button'
import { useQueryClient } from '@tanstack/react-query'
import { Validate } from '@/services/api/Validate'
import {
  createClinician,
  createStandardClinicUser,
} from '@/services/clinicUsers/clinicUsers'
import { Role } from '@/services/rbac/rbac'
import { responseError } from '@/services/api/api'
import ClinicUserForm from './ClinicUserForm'
import { ClinicUserFormData } from '../clinicUserSchemas'

type CreateUserModalProps = {
  defaultRoles?: Role[]
  className?: string
  children?: ReactNode
} & ButtonPropsVariants

export default function CreateUserModal({
  defaultRoles,
  color,
  children,
  ...props
}: CreateUserModalProps) {
  const modalRef = useRef<ModalHandles>(null)
  const queryClient = useQueryClient()

  const openModal = () => modalRef.current?.openModal()
  const closeModal = () => modalRef.current?.closeModal()

  const afterSubmit = () => {
    closeModal()
    queryClient.invalidateQueries({ queryKey: ['clinicUsers'] })
    queryClient.invalidateQueries({ queryKey: ['clinicians'] })
  }

  const handleCreate = async (
    data: ClinicUserFormData,
  ): Promise<responseError | void> => {
    const payload = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password,
      roleId: data.roleId,
    }

    if (data.userKind === 'clinician') {
      const res = await createClinician({
        ...payload,
        services: data.serviceIds.map((serviceId) => ({ serviceId })),
      })
      if (Validate.isError(res)) return res
      return undefined
    }

    const res = await createStandardClinicUser(payload)
    if (Validate.isError(res)) return res
    return undefined
  }

  return (
    <>
      <Button color={color || 'green'} {...props} onClick={openModal}>
        {children ?? 'Novo usuário'}
      </Button>
      <Modal ref={modalRef} className="m-4 w-full max-w-lg p-0">
        <HeaderForm handleClose={closeModal} title="Novo usuário" />
        <ClinicUserForm
          defaultRoles={defaultRoles}
          buttons={<Button color="green">Salvar</Button>}
          className="shadow-none"
          action={handleCreate}
          afterValidation={afterSubmit}
        />
      </Modal>
    </>
  )
}
