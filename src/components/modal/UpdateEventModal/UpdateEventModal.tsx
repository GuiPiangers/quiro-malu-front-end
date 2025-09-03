'use client'

import { ModalHandles } from '@/components/modal/Modal'
import { ReactNode, useRef } from 'react'
import { BlockScheduleResponse } from '@/services/scheduling/scheduling'
import Button, { ButtonPropsVariants } from '@/components/Button'
import UpdateEventModalContent from './UpdateEventModalContent'

export default function UpdateEventModal({
  color,
  children,
  formData,
  ...props
}: {
  className?: string
  children?: ReactNode
  asChild?: boolean
  formData?: Partial<BlockScheduleResponse>
} & ButtonPropsVariants) {
  const modalRef = useRef<ModalHandles>(null)
  const openModal = () => modalRef.current?.openModal()

  return (
    <>
      <Button color={color || 'green'} {...props} onClick={openModal}>
        {children}
      </Button>
      <UpdateEventModalContent ref={modalRef} formData={formData} />
    </>
  )
}
