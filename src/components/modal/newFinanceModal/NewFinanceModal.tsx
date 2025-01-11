'use client'

import Modal, { ModalHandles } from '@/components/modal/Modal'
import { forwardRef, ReactNode, useImperativeHandle, useRef } from 'react'
import { responseError } from '@/services/api/api'
import HeaderForm from '@/components/modal/HeaderModal'
import { useRouter } from 'next/navigation'
import { twMerge } from 'tailwind-merge'
import { createFinance, FinanceResponse } from '@/services/finance/Finance'
import FinanceForm from '@/components/form/finance/FinanceForm'
import Button, { ButtonPropsVariants } from '@/components/Button'

type ModalProps = {
  className?: string
  formData?: FinanceResponse
  children?: ReactNode
} & ButtonPropsVariants

export default forwardRef<ModalHandles, ModalProps>(
  function SchedulingModalContent(
    { formData, className, children, color, ...props },
    ref,
  ) {
    const modalRef = useRef<ModalHandles>(null)
    const router = useRouter()

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
      data: FinanceResponse & { patient: string; phone: string },
    ): Promise<FinanceResponse | responseError> => {
      const result = await createFinance(data)
      return result
    }

    return (
      <>
        <Button color={color || 'green'} {...props} onClick={openModal}>
          {children}
        </Button>
        <Modal
          ref={modalRef}
          className={twMerge('m-4 w-full max-w-md p-0', className)}
        >
          <HeaderForm
            handleClose={closeModal}
            title={formData?.id ? 'Editar agendamento' : 'Novo agendamento'}
          />
          <FinanceForm
            formData={formData}
            className="shadow-none"
            action={formAction}
            afterValidation={afterSubmit}
          />
        </Modal>
      </>
    )
  },
)
