'use client'

import Modal, { ModalHandles } from '@/components/modal/Modal'
import {
  MutableRefObject,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import Button, { ButtonPropsVariants } from '@/components/Button'
import HeaderForm from '@/components/modal/HeaderModal'
import { Nav } from '@/components/navigation'
import { navStyles } from '@/components/navigation/Style'
import ProgressForm from '@/app/(private)/patients/[id]/progress/components/ProgressForm'
import PatientSchedulingForm from './PatientSchedulingForm'
import { FormButtons } from './FormButtons'
import AnamnesisSchedulingFrom from './AnamnesisSchedulingForm'
import DiagnosticSchedulingForm from './DiagnosticSchedulingForm'
import { clientPatientService } from '@/services/patient/clientPatientService'
import { ProgressResponse } from '@/services/patient/PatientService'
import { Validate } from '@/services/api/Validate'
import { ProgressSchedulingForm } from './ProgressSchedulingForm'

type RealizeSchedulingProps = {
  className?: string
  children?: ReactNode
  schedulingId: string
  patientId: string
  date: string
  service: string
} & ButtonPropsVariants

export type PageStage =
  | 'progress'
  | 'payment'
  | 'anamnesis'
  | 'diagnostic'
  | 'record'

export default function RealizeScheduling({
  children,
  patientId,
  schedulingId,
  date,
  service,
  ...props
}: RealizeSchedulingProps) {
  const modalRef = useRef<ModalHandles>(null)
  const [pageStage, setPageStage] = useState<PageStage>('progress')

  const nextPage = useRef(pageStage)
  const setNextPage = useCallback((page: PageStage) => {
    nextPage.current = page
  }, [])

  const goToNextPage = useCallback(() => {
    setPageStage(nextPage.current)
  }, [])

  const handleOpen = () => modalRef.current?.openModal()
  const handleClose = () => modalRef.current?.closeModal()

  const { NavItemStyles } = navStyles({ variants: 'underline' })

  // const [progressData, setProgressData] = useState<ProgressResponse>()

  // useEffect(() => {
  //   clientPatientService
  //     .getProgress({ id: schedulingId, patientId })
  //     .then((res) => Validate.isOk(res) && setProgressData(res))
  // }, [patientId, schedulingId])

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
          <PatientSchedulingForm
            patientId={patientId}
            nextPage={nextPage}
            goToNextPage={goToNextPage}
          />
        )}
        {pageStage === 'progress' && (
          // <ProgressForm
          //   buttons={
          //     <FormButtons
          //       setNextPage={setNextPage}
          //       previousPage="diagnostic"
          //       nextPage="payment"
          //     />
          //   }
          //   afterValidation={goToNextPage}
          //   formAction={(data) => {
          //     return clientPatientService.setProgress(data)
          //   }}
          //   formData={{
          //     id: schedulingId,
          //     patientId,
          //     date,
          //     service,
          //     actualProblem: progressData?.actualProblem,
          //     procedures: progressData?.procedures,
          //   }}
          // />
          <ProgressSchedulingForm
            goToNextPage={goToNextPage}
            setNextPage={setNextPage}
            schedulingData={{
              date,
              service,
              patientId,
              schedulingId,
            }}
          />
        )}
        {pageStage === 'anamnesis' && (
          <AnamnesisSchedulingFrom
            patientId={patientId}
            setNextPage={setNextPage}
            goToNextPage={goToNextPage}
          />
        )}
        {pageStage === 'diagnostic' && (
          <DiagnosticSchedulingForm
            patientId={patientId}
            setNextPage={setNextPage}
            goToNextPage={goToNextPage}
          />
        )}
      </Modal>
    </>
  )
}
