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
  id?: string
  patientId: string
  className?: string
  children?: ReactNode
} & ButtonPropsVariants

export default function ProgressModal({
  id,
  patientId,
  children,
  ...props
}: ProgressModalProps) {
  const [progressData, setProgressData] = useState<
    ProgressResponse | undefined
  >()

  const router = useRouter()
  const modalRef = useRef<ModalHandles>(null)

  const getProgress = useCallback(async () => {
    return await clientPatientService.getProgress({ id: id!, patientId })
  }, [id, patientId])

  const handleOpen = () => modalRef.current?.openModal()
  const handleClose = () => modalRef.current?.closeModal()

  const afterSave = () => {
    router.refresh()
    handleClose()
  }

  useEffect(() => {
    getProgress().then(
      ({ actualProblem, date, id, patientId, procedures, service }) => {
        setProgressData({
          actualProblem,
          date,
          id,
          patientId,
          procedures,
          service,
        })
      },
    )
  }, [getProgress])

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
        <ProgressForm
          formData={{ ...progressData, patientId }}
          afterValidation={afterSave}
        />
      </Modal>
    </>
  )
}
