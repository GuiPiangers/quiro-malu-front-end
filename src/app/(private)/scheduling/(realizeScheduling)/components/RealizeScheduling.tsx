'use client'

import Modal, { ModalHandles } from '@/components/modal/Modal'
import { ReactNode, Reducer, useReducer, useRef, useState } from 'react'
import Button, { ButtonPropsVariants } from '@/components/Button'
import HeaderForm from '@/components/modal/HeaderModal'
import { Nav } from '@/components/navigation'
import { navStyles } from '@/components/navigation/Style'
import ProgressFormScheduling from './ProgressFormScheduling'
import Link from 'next/link'
import PaymentForm from './PaymentForm'

type RealizeSchedulingProps = {
  className?: string
  children?: ReactNode
  patientId: string
  date: string
  service: string
} & ButtonPropsVariants



export default function RealizeScheduling({
  children,
  patientId,
  date,
  service,
  ...props
}: RealizeSchedulingProps) {
  const modalRef = useRef<ModalHandles>(null)
  const [pageStage, setPageStage] = useState<'progress' | 'payment'>('progress')
  const [formState, setFormState] = useState({
    progress: {}, payment: {}
  })

  const handleOpen = () => modalRef.current?.openModal()
  const handleClose = () => modalRef.current?.closeModal()
  console.log(formState)

  const { NavItemStyles } = navStyles({ variants: 'underline' })

  const form = () => {
    switch (pageStage) {
      case 'progress':
        return <ProgressFormScheduling
          formData={{patientId, date, service}} 
          handleFormState={setFormState}
          afterValidation={()=>{setPageStage('payment')}}
        />

      case 'payment':
        return <PaymentForm handleFormState={setFormState} formData={{price: 120}}></PaymentForm>
      default:
        break
    }
  }

  return (
    <>
      <Button {...props} onClick={handleOpen}>
        {children}
      </Button>
      <Modal ref={modalRef} className="m-5 w-full max-w-screen-sm p-0 max-h-screen overflow-auto">
        <HeaderForm
          title="Realizar Consulta"
          className="text-2xl"
          handleClose={handleClose}
        />
        <Nav.root className="m-auto max-w-screen-lg justify-between items-center">
          <div className='flex'>
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
          <div className=' flex gap-2 pr-4'>
              <Button asChild variant='outline' size='small'>
                <Link href={'/'} className='text-sm'>Fixa do paciente</Link>
              </Button>
              <Button asChild variant='outline' size='small'>
              <Link href={'/'} className='text-sm'>Anamnese</Link>
              </Button>
            
            </div>
        </Nav.root>
        {form()}
      </Modal>
    </>
  )
}
