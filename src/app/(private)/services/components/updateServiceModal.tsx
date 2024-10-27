'use client'

import Modal, { ModalHandles } from '@/components/modal/Modal'
import { useRef } from 'react'
import ServiceForm from './ServiceForm'
import { clientService } from '@/services/service/clientService'
import { ServiceResponse } from '@/services/service/Service'
import { responseError } from '@/services/api/api'
import HeaderForm from '@/components/modal/HeaderModal'
import { useRouter } from 'next/navigation'
import { Table } from '@/components/table'
import Button from '@/components/Button'
import useSnackbarContext from '@/hooks/useSnackbarContext copy'
import { Time } from '@/utils/Time'
import { Validate } from '@/services/api/Validate'

export default function UpdateServiceModal({
  service,
}: {
  service: ServiceResponse
}) {
  const { handleMessage } = useSnackbarContext()
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
    return await clientService.update(data)
  }
  const deleteService = async () => {
    const res = service.id ? await clientService.delete(service.id) : undefined

    if (Validate.isError(res)) {
      handleMessage({ title: 'Erro!', description: res.message, type: 'error' })
    } else {
      router.refresh()
      closeModal()
      handleMessage({ title: 'Serviço deletado com sucesso!', type: 'success' })
    }
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
        <Table.Cell>
          {new Time(service.duration).getHoursAndMinutes()}
        </Table.Cell>
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
              <Button
                type="button"
                variant="outline"
                color="red"
                onClick={deleteService}
              >
                Excluir
              </Button>
            </>
          }
        />
      </Modal>
    </>
  )
}
