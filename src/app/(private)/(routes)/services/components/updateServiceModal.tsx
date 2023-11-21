'use client'

import Modal, { ModalHandles } from '@/components/modal/Modal'
import { useRef } from 'react'
import ServiceForm from './ServiceForm'
import { clientService } from '@/services/service/clientService'
import { ServiceResponse } from '@/services/service/Service'
import { responseError } from '@/services/api/api'
import HeaderForm from '@/components/form/HeaderForm'
import { useRouter } from 'next/navigation'
import { Table } from '@/components/table'
import Button from '@/components/Button'

export default function UpdateServiceModal({
  service,
}: {
  service: ServiceResponse
}) {
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
    return await clientService.update(data)
  }

  const toHoursAndMinutes = (value: number) => {
    const hours = Math.floor(value / (60 * 60))
    const minutes = (value % (60 * 60)) / 60

    if (hours <= 0 && minutes <= 0) return '-'

    return `${hours}h ${minutes}min`
  }

  return (
    <>
      <Table.Row clickable columns={['2fr', '2fr', '1fr']} onClick={openModal}>
        <Table.Cell>{service.name}</Table.Cell>
        <Table.Cell>
          {Intl.NumberFormat('pt-br', {
            style: 'currency',
            currency: 'BRL',
          }).format(service.value) || '-'}
        </Table.Cell>
        <Table.Cell>{toHoursAndMinutes(service.duration)}</Table.Cell>
      </Table.Row>

      <Modal ref={modalRef} className="m-4 w-full max-w-md p-0">
        <HeaderForm handleClose={closeModal} title="Editar serviço" />
        <ServiceForm
          formData={service}
          className="shadow-none"
          action={createService}
          afterValidation={afterSubmit}
          buttons={
            <>
              <Button color="green" type="submit">
                Salvar
              </Button>
              <Button type="button" color="red">
                Excluir
              </Button>
            </>
          }
        />
      </Modal>
    </>
  )
}
