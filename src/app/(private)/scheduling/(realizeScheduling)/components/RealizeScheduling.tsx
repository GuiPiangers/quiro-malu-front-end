'use client'

import Modal, { ModalHandles } from '@/components/modal/Modal'
import { Dispatch, ReactNode, SetStateAction, useRef, useState } from 'react'
import Button, { ButtonPropsVariants } from '@/components/Button'
import HeaderForm from '@/components/modal/HeaderModal'
import { Nav } from '@/components/navigation'
import { navStyles } from '@/components/navigation/Style'
import ProgressForm from '@/app/(private)/patients/[id]/progress/components/ProgressForm'
import PatientDataForm from '@/app/(private)/patients/components/PatientDataForm'
import PatientSchedulingFrom from './PatientSchedulingFrom'

type RealizeSchedulingProps = {
  className?: string
  children?: ReactNode
  patientId: string
  date: string
  service: string
} & ButtonPropsVariants

function FormButton({
  setPageStage,
}: {
  setPageStage: Dispatch<
    SetStateAction<
      'progress' | 'payment' | 'anamnesis' | 'diagnostic' | 'record'
    >
  >
}) {
  return (
    <div className="flex justify-end gap-2">
      <Button variant="outline" onClick={() => setPageStage('progress')}>
        Voltar
      </Button>
      <Button variant="outline" onClick={() => setPageStage('payment')}>
        Próximo
      </Button>
    </div>
  )
}
export default function RealizeScheduling({
  children,
  patientId,
  date,
  service,
  ...props
}: RealizeSchedulingProps) {
  const modalRef = useRef<ModalHandles>(null)
  const [pageStage, setPageStage] = useState<
    'progress' | 'payment' | 'anamnesis' | 'diagnostic' | 'record'
  >('progress')

  const handleOpen = () => modalRef.current?.openModal()
  const handleClose = () => modalRef.current?.closeModal()

  const { NavItemStyles } = navStyles({ variants: 'underline' })

  return (
    <>
      <Button {...props} onClick={handleOpen}>
        {children}
      </Button>
      <Modal
        ref={modalRef}
        className="m-5 max-h-screen w-full max-w-screen-sm overflow-auto p-0"
      >
        <HeaderForm
          title="Realizar Consulta"
          className="text-2xl"
          handleClose={handleClose}
        />
        <Nav.root className="m-auto max-w-screen-lg items-center justify-between">
          <div className="flex">
            <button
              onClick={() => setPageStage('record')}
              className={NavItemStyles({ active: pageStage === 'record' })}
            >
              Ficha
            </button>
            <button
              onClick={() => setPageStage('anamnesis')}
              className={NavItemStyles({ active: pageStage === 'anamnesis' })}
            >
              Anamnese
            </button>
            <button
              onClick={() => setPageStage('diagnostic')}
              className={NavItemStyles({ active: pageStage === 'diagnostic' })}
            >
              Diagnostic
            </button>
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
          </div>
          <div className=" flex gap-2 pr-4"></div>
        </Nav.root>
        {pageStage === 'record' && (
          <PatientSchedulingFrom patientId={patientId} />
        )}
        {pageStage === 'progress' && (
          <ProgressForm
            buttons={<FormButton setPageStage={setPageStage} />}
            formAction={() => {
              console.log('clicou')
              return undefined
            }}
            formData={{
              patientId,
              date,
              service,
            }}
          />
        )}
      </Modal>
    </>
  )
}
