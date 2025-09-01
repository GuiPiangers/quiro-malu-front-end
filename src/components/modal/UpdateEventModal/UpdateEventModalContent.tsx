'use client'

import Modal, { ModalHandles } from '@/components/modal/Modal'
import { forwardRef, useImperativeHandle, useRef } from 'react'
import { BlockScheduleResponse } from '@/services/scheduling/scheduling'
import HeaderForm from '@/components/modal/HeaderModal'
import { twMerge } from 'tailwind-merge'
import EventForm from '@/components/form/scheduling/EventForm'
import { useCreateBlockEvent } from '@/hooks/scheduling/useCreateBlockEvent'

type ModalProps = {
  className?: string
  formData?: Partial<BlockScheduleResponse>
}

export default forwardRef<ModalHandles, ModalProps>(
  function UpdateEventModalContent({ formData, className }, ref) {
    const modalRef = useRef<ModalHandles>(null)
    const createBlockEvent = useCreateBlockEvent()

    const openModal = () => {
      modalRef.current?.openModal()
    }
    const closeModal = () => modalRef.current?.closeModal()
    const isOpen = !!modalRef.current?.isOpen

    useImperativeHandle(ref, () => {
      return { openModal, closeModal, isOpen }
    })

    return (
      <Modal
        ref={modalRef}
        className={twMerge('m-4 w-full max-w-md p-0', className)}
      >
        <HeaderForm handleClose={closeModal} title={'Editar Evento'} />

        <EventForm
          action={async (data) => {
            const result = await createBlockEvent.mutateAsync(data)
            return result
          }}
          afterValidation={closeModal}
          formData={{
            date: formData?.date,
            endDate: formData?.date
              ? new Date(
                  new Date(formData.date).getTime() + 60 * 60 * 1000,
                ).toISOString()
              : undefined,
            ...formData,
          }}
        />
      </Modal>
    )
  },
)
