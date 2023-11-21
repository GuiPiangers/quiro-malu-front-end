'use client'

import Modal, { ModalHandles } from '@/components/modal/Modal'
import ProgressForm from './ProgressForm'
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { clientPatientService } from '@/services/patient/clientPatientService'
import { ProgressResponse } from '@/services/patient/PatientService'
import Button, { ButtonPropsVariants } from '@/components/Button'
import { useRouter } from 'next/navigation'
import HeaderForm from '@/components/form/HeaderForm'

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
