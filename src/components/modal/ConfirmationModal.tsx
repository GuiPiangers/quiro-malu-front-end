import { forwardRef, useImperativeHandle, useRef } from 'react'
import Button, { ButtonPropsVariants } from '../Button'
import Modal, { ModalHandles } from './Modal'

type ConfirmationModalProps = {
  title?: string
  description?: string
  buttonConfig?: ButtonPropsVariants
  buttonText: string
  action(): void
}
export type ModalRef = {
  openModal(): void
  closeModal(): void
}

export default forwardRef<ModalRef, ConfirmationModalProps>(
  function ConfirmationModal(
    { action, title, description, buttonText, buttonConfig },
    ref,
  ) {
    const modalHandle = useRef<ModalHandles>(null)
    const closeModal = () => modalHandle.current?.closeModal()
    const openModal = () => modalHandle.current?.openModal()

    useImperativeHandle(ref, () => {
      return { openModal, closeModal }
    })

    return (
      <Modal
        ref={modalHandle}
        className="flex max-w-sm flex-col items-center justify-center gap-2 p-8"
      >
        <h1 className="text-xl font-bold">{title}</h1>

        <p className="text-sm">{description}</p>

        <div className="mt-4 flex w-full justify-stretch gap-2">
          <Button
            color="black"
            variant="outline"
            className="w-full"
            onClick={closeModal}
          >
            Cancelar
          </Button>

          <Button className="w-full" {...buttonConfig} onClick={action}>
            {buttonText}
          </Button>
        </div>
      </Modal>
    )
  },
)
