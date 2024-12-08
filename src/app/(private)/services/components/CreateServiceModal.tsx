'use client'

import Modal, { ModalHandles } from '@/components/modal/Modal'
import { ReactNode, useRef } from 'react'
import ServiceForm from './ServiceForm'
import { ServiceResponse } from '@/services/service/actions/service'
import { responseError } from '@/services/api/api'
import HeaderForm from '@/components/modal/HeaderModal'
import { useRouter } from 'next/navigation'
import Button, { ButtonPropsVariants } from '@/components/Button'
import { useCreateService } from '@/hooks/service/useCreateService'

export default function CreateServiceModal({
  color,
  children,
  ...props
}: { className?: string; children?: ReactNode } & ButtonPropsVariants) {
  const modalRef = useRef<ModalHandles>(null)
  const router = useRouter()
  const createService = useCreateService()

  const openModal = () => modalRef.current?.openModal()
  const closeModal = () => modalRef.current?.closeModal()

  const afterSubmit = () => {
    closeModal()
    router.refresh()
  }

  const handleCreateService = async (
    data: ServiceResponse,
  ): Promise<ServiceResponse | responseError> => {
    createService.mutate(data)
    return data
  }

  return (
    <>
      <Button color={color || 'green'} {...props} onClick={openModal}>
        {children}
      </Button>
      <Modal ref={modalRef} className="m-4 w-full max-w-md p-0">
        <HeaderForm handleClose={closeModal} title="Novo serviço" />
        <ServiceForm
          buttons={<Button color="green">Salvar</Button>}
          className="shadow-none"
          action={handleCreateService}
          afterValidation={afterSubmit}
        />
      </Modal>
    </>
  )
}
