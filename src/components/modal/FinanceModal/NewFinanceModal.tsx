'use client'

import Modal, { ModalHandles } from '@/components/modal/Modal'
import { forwardRef, ReactNode, useImperativeHandle, useRef } from 'react'
import { responseError } from '@/services/api/api'
import HeaderForm from '@/components/modal/HeaderModal'
import { useRouter } from 'next/navigation'
import { twMerge } from 'tailwind-merge'
import {
  createFinance,
  deleteFinance,
  FinanceResponse,
} from '@/services/finance/Finance'
import FinanceForm from '@/components/form/finance/FinanceForm'
import Button, { ButtonPropsVariants } from '@/components/Button'
import { Validate } from '@/services/api/Validate'

type ModalProps = {
  className?: string
  formData?: FinanceResponse
  buttons?: ReactNode
  children?: ReactNode
} & ButtonPropsVariants & { asChild?: boolean }

export default forwardRef<ModalHandles, ModalProps>(
  function SchedulingModalContent(
    { formData, className, children, color, buttons, ...props },
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

    const handleDeleteFinance = async () => {
      if (!formData?.id) return

      const response = await deleteFinance({ id: formData?.id })

      if (Validate.isOk(response)) {
        router.refresh()
      }
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
            title={formData?.id ? 'Editar registro' : 'Novo registro'}
          />
          <FinanceForm
            btWrapperClassName="justify-between"
            buttons={
              <>
                <Button type="submit" color="green">
                  Salvar
                </Button>

                {formData?.id && (
                  <Button
                    type="button"
                    color="red"
                    onClick={() => handleDeleteFinance()}
                  >
                    Excluir
                  </Button>
                )}
              </>
            }
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
