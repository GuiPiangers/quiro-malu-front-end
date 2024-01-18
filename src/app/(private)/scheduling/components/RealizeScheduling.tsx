'use client'

import Modal, { ModalHandles } from '@/components/modal/Modal'
import ProgressForm from '../../patients/[id]/progress/components/ProgressForm'
import { ReactNode, useRef } from 'react'
import { ProgressResponse } from '@/services/patient/PatientService'
import Button, { ButtonPropsVariants } from '@/components/Button'
import { useRouter } from 'next/navigation'
import HeaderForm from '@/components/modal/HeaderModal'

type RealizeSchedulingProps = {
  className?: string
  children?: ReactNode
  patientId: string
} & ButtonPropsVariants

export default function RealizeScheduling({
  children,
  patientId,
  ...props
}: RealizeSchedulingProps) {
  const router = useRouter()
  const modalRef = useRef<ModalHandles>(null)

  const handleOpen = () => modalRef.current?.openModal()
  const handleClose = () => modalRef.current?.closeModal()

  const afterSave = () => {
    router.refresh()
    handleClose()
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
          formData={{ patientId }}
          afterValidation={afterSave}
          className="shadow-none"
          btWrapperClassName="flex-row-reverse w-full"
          buttons={
            <>
              <Button type="submit" color="green">
                Avançar
              </Button>
              <Button
                type="button"
                color="black"
                variant="outline"
                onClick={handleClose}
              >
                voltar
              </Button>
            </>
          }
        />
      </Modal>
    </>
  )
}
