'use client'

import Modal, { ModalHandles } from '@/components/modal/Modal'
import { forwardRef, useImperativeHandle, useRef } from 'react'
import SchedulingForm from '../../../app/(private)/scheduling/components/SchedulingForm'
import { SchedulingResponse } from '@/services/scheduling/scheduling'
import { responseError } from '@/services/api/api'
import HeaderForm from '@/components/modal/HeaderModal'
import { useRouter } from 'next/navigation'
import { SchedulingStatusEnum } from '@/services/scheduling/schedulingStatusEnum'
import { useUpdateScheduling } from '@/hooks/scheduling/useUpdateScheduling'
import { useCreateScheduling } from '@/hooks/scheduling/useCreateScheduling'
import { twMerge } from 'tailwind-merge'

type ModalProps = {
  className?: string
  formData?: Partial<
    SchedulingResponse & { patient: string; patientPhone: string }
  >
}

export default forwardRef<ModalHandles, ModalProps>(
  function SchedulingModalContent({ formData, className }, ref) {
    const modalRef = useRef<ModalHandles>(null)
    const router = useRouter()
    const updateScheduling = useUpdateScheduling()
    const createScheduling = useCreateScheduling()

    const openModal = () => modalRef.current?.openModal()
    const closeModal = () => modalRef.current?.closeModal()
    const isOpen = !!modalRef.current?.isOpen

    useImperativeHandle(ref, () => {
      return { openModal, closeModal, isOpen }
    })

    const afterSubmit = () => {
      closeModal()
      router.refresh()
    }

    const formAction = async (
      data: SchedulingResponse & { patient: string; phone: string },
    ): Promise<SchedulingResponse | responseError> => {
      if (formData?.id) return await updateScheduling.mutateAsync(data)

      const result = await createScheduling.mutateAsync(data)
      return result
    }

    return (
      <Modal
        ref={modalRef}
        className={twMerge('m-4 w-full max-w-md p-0', className)}
      >
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
    )
  },
)
