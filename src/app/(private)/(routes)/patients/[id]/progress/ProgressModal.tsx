'use client'

import Modal, { ModalHandles } from '@/components/modal/Modal'
import ProgressForm from './ProgressForm'
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { clientPatientService } from '@/services/patient/clientPatientService'
import { ProgressResponse } from '@/services/patient/PatientService'
import Button, { ButtonPropsVariants } from '@/components/Button'
import { CgClose } from 'react-icons/cg'
import { useRouter } from 'next/navigation'

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
      <Modal ref={modalRef} className="m-5 w-full max-w-screen-sm space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-main">Evolução</h2>
          <CgClose
            size={22}
            onClick={handleClose}
            className="cursor-pointer rounded p-0.5 hover:bg-slate-100 "
          />
        </div>
        <ProgressForm formData={progressData} afterValidation={afterSave} />
      </Modal>
    </>
  )
}
