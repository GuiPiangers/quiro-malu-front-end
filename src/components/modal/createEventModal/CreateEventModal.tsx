'use client'

import { ModalHandles } from '@/components/modal/Modal'
import { ReactNode, useRef } from 'react'
import { BlockScheduleResponse } from '@/services/scheduling/scheduling'
import Button, { ButtonPropsVariants } from '@/components/Button'
import CreateEventModalContent from './CreateEventModalContent'

export default function CreateEventModal({
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
      <CreateEventModalContent ref={modalRef} formData={formData} />
    </>
  )
}
