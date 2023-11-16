/* eslint-disable react/display-name */
'use client'

import {
  HTMLAttributes,
  ReactNode,
  forwardRef,
  useState,
  useImperativeHandle,
} from 'react'
import { Modal as BaseModal } from '@mui/base/Modal'
import { twMerge } from 'tailwind-merge'

type ModalProps = {
  children: ReactNode
  className?: string
}

export type ModalHandles = {
  openModal(): void
  closeModal(): void
  isOpen: boolean
}

export default forwardRef<ModalHandles, ModalProps>(function Modal(
  { children, className },
  ref,
) {
  const [open, setOpen] = useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  useImperativeHandle(ref, () => {
    return { openModal: handleOpen, closeModal: handleClose, isOpen: open }
  })

  return (
    <BaseModal
      aria-labelledby="unstyled-modal-title"
      aria-describedby="unstyled-modal-description"
      open={open}
      onClose={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center"
      slots={{ backdrop: Backdrop }}
    >
      <div className={twMerge('rounded-lg bg-white p-4', className)}>
        {children}
      </div>
    </BaseModal>
  )
})

const Backdrop = forwardRef(
  (props: HTMLAttributes<HTMLDivElement> & { open: boolean }, ref: any) => {
    const { open, className, ...other } = props
    return (
      <div
        className={'fixed inset-0 -z-10 bg-black bg-opacity-50 '}
        ref={ref}
        {...other}
      />
    )
  },
)
