/* eslint-disable react/display-name */
'use client'

import {
  HTMLAttributes,
  ReactNode,
  forwardRef,
  useState,
  createContext,
} from 'react'
import { Modal as BaseModal } from '@mui/base/Modal'

type ModalContextType = {
  open: boolean
  handleOpen(): void
  handleClose(): void
}

type Modal = {
  children: ReactNode
  trigger: ReactNode
}

export const ModalContext = createContext({} as ModalContextType)

export default function Modal({ children, trigger }: Modal) {
  const [open, setOpen] = useState(false)
  const handleOpen = () => {
    console.log('abrido')
    setOpen(true)
  }
  const handleClose = () => setOpen(false)

  return (
    <ModalContext.Provider value={{ open, handleOpen, handleClose }}>
      {trigger}
      <BaseModal
        aria-labelledby="unstyled-modal-title"
        aria-describedby="unstyled-modal-description"
        open={open}
        onClose={handleClose}
        slots={{ backdrop: Backdrop }}
      >
        <div className="h-96 w-96 bg-slate-600">{children}</div>
      </BaseModal>
    </ModalContext.Provider>
  )
}

const Backdrop = forwardRef(
  (props: HTMLAttributes<HTMLDivElement> & { open: boolean }, ref: any) => {
    const { open, className, ...other } = props
    return <div className={'bg-black bg-opacity-50'} ref={ref} {...other} />
  },
)
