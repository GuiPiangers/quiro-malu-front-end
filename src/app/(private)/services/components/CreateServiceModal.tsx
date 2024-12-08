'use client'

import Modal, { ModalHandles } from '@/components/modal/Modal'
import { ReactNode, useRef } from 'react'
import ServiceForm from './ServiceForm'
import { ServiceResponse } from '@/services/service/actions/service'
import { responseError } from '@/services/api/api'
import HeaderForm from '@/components/modal/HeaderModal'
import { useRouter } from 'next/navigation'
import Button, { ButtonPropsVariants } from '@/components/Button'

export default function CreateServiceModal({
  color,
  children,
  ...props
}: { className?: string; children?: ReactNode } & ButtonPropsVariants) {
  const modalRef = useRef<ModalHandles>(null)
  const router = useRouter()

  const openModal = () => modalRef.current?.openModal()
  const closeModal = () => modalRef.current?.closeModal()

  const afterSubmit = () => {
    closeModal()
    router.refresh()
  }

  const createService = async (
    data: ServiceResponse,
  ): Promise<ServiceResponse | responseError> => {
    return await createService(data)
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
          action={createService}
          afterValidation={afterSubmit}
        />
      </Modal>
    </>
  )
}
