'use client'

import Modal, { ModalHandles } from '@/components/modal/Modal'
import { ReactNode, useRef } from 'react'
import SchedulingForm from './SchedulingForm'
import { SchedulingResponse } from '@/services/scheduling/actions/scheduling'
import { responseError } from '@/services/api/api'
import HeaderForm from '@/components/modal/HeaderModal'
import { useRouter } from 'next/navigation'
import Button, { ButtonPropsVariants } from '@/components/Button'
import { SchedulingStatusEnum } from '@/services/scheduling/actions/schedulingStatusEnum'
import { useUpdateScheduling } from '@/hooks/scheduling/useUpdateScheduling'
import { useCreateScheduling } from '@/hooks/scheduling/useCreateScheduling'

export default function SchedulingModal({
  color,
  children,
  formData,
  ...props
}: {
  className?: string
  children?: ReactNode
  asChild?: boolean
  formData?: Partial<
    SchedulingResponse & { patient: string; patientPhone: string }
  >
} & ButtonPropsVariants) {
  const modalRef = useRef<ModalHandles>(null)
  const router = useRouter()
  const updateScheduling = useUpdateScheduling()
  const createScheduling = useCreateScheduling()

  const openModal = () => modalRef.current?.openModal()
  const closeModal = () => modalRef.current?.closeModal()

  const afterSubmit = () => {
    closeModal()
    router.refresh()
  }

  const formAction = async (
    data: SchedulingResponse & { patient: string; phone: string },
  ): Promise<SchedulingResponse | responseError> => {
    updateScheduling.mutate(data)
    if (formData?.id) return data

    const result = await createScheduling.mutateAsync(data)
    console.log(result)
    return result
  }

  return (
    <>
      <Button color={color || 'green'} {...props} onClick={openModal}>
        {children}
      </Button>
      <Modal ref={modalRef} className="m-4 w-full max-w-md p-0">
        <HeaderForm
          handleClose={closeModal}
          title={formData?.id ? 'Editar agendamento' : 'Novo agendamento'}
        />
        <SchedulingForm
          formData={{ status: SchedulingStatusEnum.scheduled, ...formData }}
          className="shadow-none"
          action={formAction}
          afterValidation={afterSubmit}
        />
      </Modal>
    </>
  )
}
