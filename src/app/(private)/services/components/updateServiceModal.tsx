'use client'

import Modal, { ModalHandles } from '@/components/modal/Modal'
import { useRef } from 'react'
import ServiceForm from './ServiceForm'
import { ServiceResponse } from '@/services/service/Service'
import { responseError } from '@/services/api/api'
import HeaderForm from '@/components/modal/HeaderModal'
import { useRouter } from 'next/navigation'
import { Table } from '@/components/table'
import Button from '@/components/Button'
import useSnackbarContext from '@/hooks/useSnackbarContext'
import { Time } from '@/utils/Time'
import { Validate } from '@/services/api/Validate'
import { useDeleteService } from '@/hooks/service/useDeleteService'
import { useUpdateService } from '@/hooks/service/useUpdateService'

export default function UpdateServiceModal({
  service,
}: {
  service: ServiceResponse
}) {
  const { handleMessage } = useSnackbarContext()
  const modalRef = useRef<ModalHandles>(null)
  const router = useRouter()
  const deleteService = useDeleteService()
  const updateService = useUpdateService()

  const openModal = () => modalRef.current?.openModal()
  const closeModal = () => modalRef.current?.closeModal()

  const afterSubmit = () => {
    closeModal()
    router.refresh()
  }

  const createService = async (
    data: ServiceResponse,
  ): Promise<ServiceResponse | responseError> => {
    return await updateService.mutateAsync(data)
  }
  const handleDeleteService = async () => {
    const res = service.id
      ? deleteService.mutate({ id: service.id })
      : undefined

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
                onClick={handleDeleteService}
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
