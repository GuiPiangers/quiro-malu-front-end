'use client'

import Modal, { ModalHandles } from '@/components/modal/Modal'
import ProgressForm from '../../patients/[id]/progress/components/ProgressForm'
import { ReactNode, useRef, useState } from 'react'
import Button, { ButtonPropsVariants } from '@/components/Button'
import { useRouter } from 'next/navigation'
import HeaderForm from '@/components/modal/HeaderModal'
import { Nav } from '@/components/navigation'
import { navStyles } from '@/components/navigation/Style'

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
  const [pageStage, setPageStage] = useState<'progress' | 'payment'>('progress')

  const handleOpen = () => modalRef.current?.openModal()
  const handleClose = () => modalRef.current?.closeModal()

  const { NavItemStyles } = navStyles({ variants: 'underline' })

  const afterSave = () => {
    router.refresh()
    handleClose()
  }

  const form = () => {
    switch (pageStage) {
      case 'progress':
        return (
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
              </>
            }
          />
        )

      case 'payment':
        return <div></div>
      default:
        break
    }
  }

  return (
    <>
      <Button {...props} onClick={handleOpen}>
        {children}
      </Button>
      <Modal ref={modalRef} className="m-5 w-full max-w-screen-sm p-0">
        <HeaderForm
          title="Realizar Consulta"
          className="text-2xl"
          handleClose={handleClose}
        />
        <Nav.root className="m-auto max-w-screen-lg">
          <button
            onClick={() => setPageStage('progress')}
            className={NavItemStyles({ active: pageStage === 'progress' })}
          >
            Evolução
          </button>
          <button
            onClick={() => setPageStage('payment')}
            className={NavItemStyles({ active: pageStage === 'payment' })}
          >
            Pagamento
          </button>
        </Nav.root>
        {form()}
      </Modal>
    </>
  )
}
