'use client'

import Modal, { ModalHandles } from '@/components/modal/Modal'
import { useRef } from 'react'
import ServiceForm from './ServiceForm'
import { clientService } from '@/services/service/clientService'
import { ServiceResponse } from '@/services/service/Service'
import { responseError } from '@/services/api/api'
import HeaderForm from '@/components/form/HeaderForm'
import { useRouter } from 'next/navigation'
import Button from '@/components/Button'

export default function CreateServiceModal() {
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
  ): Promise<ServiceResponse & responseError> => {
    return await clientService.create(data)
  }

  return (
    <>
      <Button color="green" onClick={openModal}>
        Adicionar
      </Button>
      <Modal ref={modalRef} className="m-4 w-full max-w-md p-0">
        <HeaderForm handleClose={closeModal} title="Novo serviço" />
        <ServiceForm
          className="shadow-none"
          action={createService}
          afterValidation={afterSubmit}
        />
      </Modal>
    </>
  )
}
