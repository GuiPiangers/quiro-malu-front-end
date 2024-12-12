'use client'

import { ModalHandles } from '@/components/modal/Modal'
import { ReactNode, useRef } from 'react'
import { SchedulingResponse } from '@/services/scheduling/actions/scheduling'
import Button, { ButtonPropsVariants } from '@/components/Button'
import SchedulingModalContent from './SchedulingModalContent'

export default function SchedulingModal({
  color,
  children,
  formData,
  ...props
}: {
  className?: string
  children?: ReactNode
  asChild?: boolean
  formData?: Partial<
    SchedulingResponse & { patient: string; patientPhone: string }
  >
} & ButtonPropsVariants) {
  const modalRef = useRef<ModalHandles>(null)
  const openModal = () => modalRef.current?.openModal()

  return (
    <>
      <Button color={color || 'green'} {...props} onClick={openModal}>
        {children}
      </Button>
      <SchedulingModalContent ref={modalRef} formData={formData} />
    </>
  )
}
