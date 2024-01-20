'use client'

import Modal, { ModalHandles } from '@/components/modal/Modal'
import { ReactNode, Reducer, useReducer, useRef, useState } from 'react'
import Button, { ButtonPropsVariants } from '@/components/Button'
import HeaderForm from '@/components/modal/HeaderModal'
import { Nav } from '@/components/navigation'
import { navStyles } from '@/components/navigation/Style'
import ProgressFormScheduling from '../ProgressFormScheduling'

type RealizeSchedulingProps = {
  className?: string
  children?: ReactNode
  patientId: string
} & ButtonPropsVariants

type State = {
  progress: Partial<{
    date: string
    service: string
    duration: number
    patientId: string
    patient: string
    patientPhone: string
  }>
  payment: Partial<{
    value: string
  }>
}

type Action =
  | { type: 'setDate'; value: string }
  | { type: 'setService'; value: string }
  | { type: 'setDuration'; value: number }
  | { type: 'setPatientId'; value: string }
  | { type: 'setPatient'; value: string }
  | { type: 'setPatientPhone'; value: string }

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'setDate':
      return {
        progress: {
          ...state.progress,
          date: action.value,
        } as State['progress'],

        payment: state.payment,
      }
    case 'setService':
      return {
        progress: {
          ...state.progress,
          service: action.value,
        } as State['progress'],

        payment: state.payment,
      }
    case 'setDuration':
      return {
        progress: {
          ...state.progress,
          duration: action.value,
        } as State['progress'],

        payment: state.payment,
      }
    case 'setPatientId':
      return {
        progress: {
          ...state.progress,
          patientId: action.value,
        } as State['progress'],

        payment: state.payment,
      }
    case 'setPatient':
      return {
        progress: {
          ...state.progress,
          patient: action.value,
        } as State['progress'],

        payment: state.payment,
      }
    case 'setPatientPhone':
      return {
        progress: {
          ...state.progress,
          patientPhone: action.value,
        } as State['progress'],

        payment: state.payment,
      }
    default:
      return state
  }
}

export default function RealizeScheduling({
  children,
  patientId,
  ...props
}: RealizeSchedulingProps) {
  const modalRef = useRef<ModalHandles>(null)
  const [pageStage, setPageStage] = useState<'progress' | 'payment'>('progress')
  const [state, dispatch] = useReducer<Reducer<State, Action>>(reducer, {
    progress: {},
    payment: {},
  })

  const handleOpen = () => modalRef.current?.openModal()
  const handleClose = () => modalRef.current?.closeModal()

  const { NavItemStyles } = navStyles({ variants: 'underline' })

  const form = () => {
    switch (pageStage) {
      case 'progress':
        return <ProgressFormScheduling patientId={patientId} />

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
