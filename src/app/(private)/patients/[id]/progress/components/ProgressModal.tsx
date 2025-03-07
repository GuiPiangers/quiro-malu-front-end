'use client'

import Modal, { ModalHandles } from '@/components/modal/Modal'
import ProgressForm from './ProgressForm'
import { ReactNode, useRef } from 'react'
import { ProgressResponse, setProgress } from '@/services/patient/patient'
import Button, { ButtonPropsVariants } from '@/components/Button'
import { useRouter } from 'next/navigation'
import HeaderForm from '@/components/modal/HeaderModal'

type ProgressModalProps = {
  className?: string
  children?: ReactNode
  progressData: Partial<ProgressResponse>
} & ButtonPropsVariants

export default function ProgressModal({
  children,
  progressData,
  ...props
}: ProgressModalProps) {
  const router = useRouter()
  const modalRef = useRef<ModalHandles>(null)

  const handleOpen = () => modalRef.current?.openModal()
  const handleClose = () => modalRef.current?.closeModal()

  const afterSave = () => {
    router.refresh()
    handleClose()
  }

  const formAction = async (data: ProgressResponse) => {
    return setProgress(data)
  }

  return (
    <>
      <Button {...props} onClick={handleOpen}>
        {children}
      </Button>
      <Modal
        ref={modalRef}
        className="m-5 w-full max-w-screen-sm space-y-2 p-0"
      >
        <HeaderForm title="Evolução" handleClose={handleClose} />
        <ProgressForm
          formAction={formAction}
          formData={progressData}
          afterValidation={afterSave}
          className="shadow-none"
          buttons={
            <>
              <Button type="submit" className="w-32" color="green">
                Salvar
              </Button>
              <Button
                type="button"
                className="w-32"
                color="black"
                variant="outline"
                onClick={handleClose}
              >
                Cancelar
              </Button>
            </>
          }
        />
      </Modal>
    </>
  )
}
