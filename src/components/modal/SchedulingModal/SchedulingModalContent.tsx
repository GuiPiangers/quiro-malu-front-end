'use client'

import Modal, { ModalHandles } from '@/components/modal/Modal'
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import SchedulingForm from '../../../app/(private)/scheduling/components/SchedulingForm'
import {
  BlockScheduleResponse,
  SchedulingResponse,
  SchedulingWithPatient,
} from '@/services/scheduling/scheduling'
import { responseError } from '@/services/api/api'
import HeaderForm from '@/components/modal/HeaderModal'
import { useRouter } from 'next/navigation'
import { SchedulingStatusEnum } from '@/services/scheduling/schedulingStatusEnum'
import { useUpdateScheduling } from '@/hooks/scheduling/useUpdateScheduling'
import { useCreateScheduling } from '@/hooks/scheduling/useCreateScheduling'
import { twMerge } from 'tailwind-merge'
import { Nav } from '@/components/navigation'
import { navStyles } from '@/components/navigation/Style'
import EventForm from '@/components/form/scheduling/EventForm'
import { useCreateBlockEvent } from '@/hooks/scheduling/useCreateBlockEvent'

type ModalProps = {
  className?: string
  formData?: Partial<SchedulingWithPatient | BlockScheduleResponse>
  form?: 'scheduling' | 'event'
}

export default forwardRef<ModalHandles, ModalProps>(
  function SchedulingModalContent({ formData, className, form }, ref) {
    const [navForm, setNavForm] = useState<'scheduling' | 'event'>(
      form ?? 'scheduling',
    )

    const selectedForm = form ?? navForm

    const modalRef = useRef<ModalHandles>(null)
    const router = useRouter()
    const updateScheduling = useUpdateScheduling()
    const createScheduling = useCreateScheduling()
    const createBlockEvent = useCreateBlockEvent()

    const openModal = () => {
      setNavForm('scheduling')
      modalRef.current?.openModal()
    }
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

    const { NavItemStyles } = navStyles({ variants: 'underline' })

    return (
      <Modal
        ref={modalRef}
        className={twMerge('m-4 w-full max-w-md p-0', className)}
      >
        <HeaderForm
          handleClose={closeModal}
          title={
            selectedForm === 'event'
              ? 'Evento'
              : formData?.id
              ? 'Editar agendamento'
              : 'Novo agendamento'
          }
        />
        {!formData?.id && (
          <Nav.root className="m-auto max-w-screen-lg items-center justify-between">
            <div className="flex">
              <button
                onClick={() => {
                  setNavForm('scheduling')
                }}
                type="button"
                className={NavItemStyles({ active: navForm === 'scheduling' })}
              >
                Agendamento
              </button>
              <button
                onClick={() => {
                  setNavForm('event')
                }}
                type="button"
                className={NavItemStyles({ active: navForm === 'event' })}
              >
                Evento
              </button>
            </div>
            <div className=" flex gap-2 pr-4"></div>
          </Nav.root>
        )}

        {selectedForm === 'scheduling' ? (
          <SchedulingForm
            formData={{ status: SchedulingStatusEnum.scheduled, ...formData }}
            className="shadow-none"
            action={formAction}
            afterValidation={afterSubmit}
          />
        ) : (
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
          ></EventForm>
        )}
      </Modal>
    )
  },
)
