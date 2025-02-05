'use client'

import {
  forwardRef,
  SetStateAction,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import Button, { ButtonPropsVariants } from '../../Button'
import Modal, { ModalHandles } from '../Modal'
import HeaderForm from '../HeaderModal'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/input'

import { FaMinus, FaPlus } from 'react-icons/fa6'
import { Accordion } from '@/components/accordion'
import { IoChevronDown } from 'react-icons/io5'
import StopPropagation from '@/components/StopPropagation'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { generatePatientPDF } from '@/services/patientPDF/patientPDF'

type CreatePatientPDFModalProps = {
  children?: React.ReactNode
  asChild?: boolean
} & ButtonPropsVariants

export type ModalRef = {
  openModal(): void
  closeModal(): void
}

type CheckAllProps = {
  children: string
  isChecked?: boolean
  onClick?: () => void
}

type CheckComponentProps = {
  children: string
} & React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>

function CheckAllGroup({ children, isChecked, onClick }: CheckAllProps) {
  return (
    <div className="flex w-full flex-col">
      <Input.Root className="flex-row items-center">
        <StopPropagation>
          <span
            onClick={() => {
              onClick && onClick()
            }}
            className="flex items-center justify-center rounded-sm  border border-blue-500 data-[checked=true]:bg-blue-500"
            data-checked={isChecked}
          >
            {isChecked ? (
              <FaMinus className="h-4.5 w-4.5 grid place-content-center text-white" />
            ) : (
              <FaPlus className="h-4.5 w-4.5 grid place-content-center text-blue-900" />
            )}
          </span>
        </StopPropagation>
        <h3 className="flex items-center gap-2 text-lg">
          {children}{' '}
          <IoChevronDown className="group-aria-[expanded=true]:rotate-180"></IoChevronDown>
        </h3>
      </Input.Root>
      <span className="mb-2 mt-1 h-[1px] w-full bg-slate-200"></span>
    </div>
  )
}

function CheckComponent({ children, ...props }: CheckComponentProps) {
  return (
    <Input.Root className="flex-row">
      <Checkbox
        className="border-blue-500 data-[state=checked]:bg-blue-500"
        {...props}
      />
      <Input.Label>{children}</Input.Label>
    </Input.Root>
  )
}

const defaultCheckedPatientData = {
  phone: true,
  dateOfBirth: true,
  gender: true,
  cpf: true,
  maritalStatus: true,
  profession: true,
  education: true,
}

const defaultCheckedLocation = {
  cep: true,
  state: true,
  city: true,
  neighborhood: true,
  address: true,
}

const defaultCheckedAnamnesis = {
  activities: true,
  currentIllness: true,
  familiarHistory: true,
  history: true,
  mainProblem: true,
  medicines: true,
  smoke: true,
  surgeries: true,
}

const defaultCheckedDiagnostic = {
  diagnostic: true,
  treatmentPlan: true,
}

type keyCheckedPatientData = keyof typeof defaultCheckedPatientData

export default forwardRef<ModalRef, CreatePatientPDFModalProps>(
  function CreatePatientPDFModal({ children, ...buttonProps }, ref) {
    const modalHandle = useRef<ModalHandles>(null)
    const closeModal = () => modalHandle.current?.closeModal()
    const openModal = () => modalHandle.current?.openModal()

    function toggleCheckedEveryData<T extends { [key: string]: boolean }>({
      data,
      setCheckedData,
      everyDataChecked,
    }: {
      data: T
      setCheckedData: (value: SetStateAction<T>) => void
      everyDataChecked: boolean
    }) {
      const dataValues = Object.entries(data).reduce(
        (acc, [key, value]) => {
          const newObject = { ...acc }
          newObject[key] = !everyDataChecked
          return newObject
        },
        {} as { [key: string]: boolean },
      )

      setCheckedData(dataValues as T)
    }

    const [checkedPatientData, setCheckedPatientData] = useState(
      defaultCheckedPatientData,
    )

    const handleSetCheckedPatientData = (
      key: keyCheckedPatientData,
      value: boolean,
    ) => {
      setCheckedPatientData((prev) => ({ ...prev, [key]: value }))
    }

    const everyCheckedPatientData = Object.values(checkedPatientData).every(
      (value) => value,
    )

    const toggleCheckedEveryPatientData = () =>
      toggleCheckedEveryData({
        data: checkedPatientData,
        everyDataChecked: everyCheckedPatientData,
        setCheckedData: setCheckedPatientData,
      })

    const [checkedLocation, setCheckedLocation] = useState(
      defaultCheckedLocation,
    )
    const everyCheckedLocation = Object.values(checkedLocation).every(
      (value) => value,
    )

    const toggleCheckedEveryLocation = () =>
      toggleCheckedEveryData({
        data: checkedLocation,
        everyDataChecked: everyCheckedLocation,
        setCheckedData: setCheckedLocation,
      })

    const handleSetCheckedLocation = (
      key: keyof typeof defaultCheckedLocation,
      value: boolean,
    ) => {
      setCheckedLocation((prev) => ({ ...prev, [key]: value }))
    }

    const [checkedAnamnesis, setCheckedAnamnesis] = useState(
      defaultCheckedAnamnesis,
    )
    const everyCheckedAnamnesis = Object.values(checkedAnamnesis).every(
      (value) => value,
    )

    const toggleCheckedEveryAnamnesis = () =>
      toggleCheckedEveryData({
        data: checkedAnamnesis,
        everyDataChecked: everyCheckedAnamnesis,
        setCheckedData: setCheckedAnamnesis,
      })

    const handleSetCheckedAnamnesis = (
      key: keyof typeof defaultCheckedAnamnesis,
      value: boolean,
    ) => {
      setCheckedAnamnesis((prev) => ({ ...prev, [key]: value }))
    }

    const [checkedDiagnostic, setCheckedDiagnostic] = useState(
      defaultCheckedDiagnostic,
    )
    const everyCheckedDiagnostic = Object.values(checkedDiagnostic).every(
      (value) => value,
    )

    const toggleCheckedEveryDiagnostic = () =>
      toggleCheckedEveryData({
        data: checkedDiagnostic,
        everyDataChecked: everyCheckedDiagnostic,
        setCheckedData: setCheckedDiagnostic,
      })

    const handleSetCheckedDiagnostic = (
      key: keyof typeof defaultCheckedDiagnostic,
      value: boolean,
    ) => {
      setCheckedDiagnostic((prev) => ({ ...prev, [key]: value }))
    }

    useImperativeHandle(ref, () => {
      return { openModal, closeModal }
    })

    return (
      <>
        <Button
          {...buttonProps}
          onClick={() => {
            openModal()
          }}
        >
          {children}
        </Button>

        <Modal ref={modalHandle} className="w-full max-w-md p-0">
          <HeaderForm title="Gerar PDF do Paciente" handleClose={closeModal} />
          <div className="p-4">
            <Accordion.Root>
              <Accordion.Item>
                <Accordion.Trigger>
                  <CheckAllGroup
                    isChecked={everyCheckedPatientData}
                    onClick={toggleCheckedEveryPatientData}
                  >
                    Dados Pessoais
                  </CheckAllGroup>
                </Accordion.Trigger>

                <Accordion.Content>
                  <div className="ml-6">
                    <Input.Root className="flex-row">
                      <Checkbox
                        checked
                        disabled
                        className="border-blue-500 data-[state=checked]:bg-blue-500"
                      />
                      <Input.Label>Nome</Input.Label>
                    </Input.Root>

                    <CheckComponent
                      checked={checkedPatientData.phone}
                      onCheckedChange={(value) =>
                        handleSetCheckedPatientData('phone', !!value)
                      }
                    >
                      Telefone
                    </CheckComponent>

                    <CheckComponent
                      checked={checkedPatientData.dateOfBirth}
                      onCheckedChange={(value) =>
                        handleSetCheckedPatientData('dateOfBirth', !!value)
                      }
                    >
                      Data de Nascimento
                    </CheckComponent>

                    <CheckComponent
                      checked={checkedPatientData.gender}
                      onCheckedChange={(value) =>
                        handleSetCheckedPatientData('gender', !!value)
                      }
                    >
                      Gênero
                    </CheckComponent>

                    <CheckComponent
                      checked={checkedPatientData.cpf}
                      onCheckedChange={(value) =>
                        handleSetCheckedPatientData('cpf', !!value)
                      }
                    >
                      CPF
                    </CheckComponent>

                    <CheckComponent
                      checked={checkedPatientData.maritalStatus}
                      onCheckedChange={(value) =>
                        handleSetCheckedPatientData('maritalStatus', !!value)
                      }
                    >
                      Estado Civil
                    </CheckComponent>

                    <CheckComponent
                      checked={checkedPatientData.education}
                      onCheckedChange={(value) =>
                        handleSetCheckedPatientData('education', !!value)
                      }
                    >
                      Escolaridade
                    </CheckComponent>

                    <CheckComponent
                      checked={checkedPatientData.profession}
                      onCheckedChange={(value) =>
                        handleSetCheckedPatientData('profession', !!value)
                      }
                    >
                      Profissão
                    </CheckComponent>
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>

            <Accordion.Root>
              <Accordion.Item>
                <Accordion.Trigger>
                  <CheckAllGroup
                    isChecked={everyCheckedLocation}
                    onClick={toggleCheckedEveryLocation}
                  >
                    Endereço
                  </CheckAllGroup>
                </Accordion.Trigger>

                <Accordion.Content>
                  <div className="ml-6">
                    <Input.Root className="flex-row">
                      <Checkbox
                        checked={checkedLocation.cep}
                        className="border-blue-500 data-[state=checked]:bg-blue-500"
                        onCheckedChange={(value) =>
                          handleSetCheckedLocation('cep', !!value)
                        }
                      />
                      <Input.Label>CEP</Input.Label>
                    </Input.Root>

                    <CheckComponent
                      checked={checkedLocation.state}
                      onCheckedChange={(value) =>
                        handleSetCheckedLocation('state', !!value)
                      }
                    >
                      Estado
                    </CheckComponent>

                    <CheckComponent
                      checked={checkedLocation.city}
                      onCheckedChange={(value) =>
                        handleSetCheckedLocation('city', !!value)
                      }
                    >
                      Cidade
                    </CheckComponent>

                    <CheckComponent
                      checked={checkedLocation.neighborhood}
                      onCheckedChange={(value) =>
                        handleSetCheckedLocation('neighborhood', !!value)
                      }
                    >
                      Bairro
                    </CheckComponent>

                    <CheckComponent
                      checked={checkedLocation.address}
                      onCheckedChange={(value) =>
                        handleSetCheckedLocation('address', !!value)
                      }
                    >
                      Endereço
                    </CheckComponent>
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>

            <Accordion.Root>
              <Accordion.Item>
                <Accordion.Trigger>
                  <CheckAllGroup
                    isChecked={everyCheckedAnamnesis}
                    onClick={toggleCheckedEveryAnamnesis}
                  >
                    Anamnesis
                  </CheckAllGroup>
                </Accordion.Trigger>

                <Accordion.Content>
                  <div className="ml-6">
                    <Input.Root className="flex-row">
                      <Checkbox
                        checked={checkedAnamnesis.mainProblem}
                        className="border-blue-500 data-[state=checked]:bg-blue-500"
                        onCheckedChange={(value) =>
                          handleSetCheckedAnamnesis('mainProblem', !!value)
                        }
                      />
                      <Input.Label>Queixa principal</Input.Label>
                    </Input.Root>

                    <CheckComponent
                      checked={checkedAnamnesis.currentIllness}
                      onCheckedChange={(value) =>
                        handleSetCheckedAnamnesis('currentIllness', !!value)
                      }
                    >
                      História e moléstia atual
                    </CheckComponent>

                    <CheckComponent
                      checked={checkedAnamnesis.history}
                      onCheckedChange={(value) =>
                        handleSetCheckedAnamnesis('history', !!value)
                      }
                    >
                      Histórico e antecedentes
                    </CheckComponent>

                    <CheckComponent
                      checked={checkedAnamnesis.familiarHistory}
                      onCheckedChange={(value) =>
                        handleSetCheckedAnamnesis('familiarHistory', !!value)
                      }
                    >
                      Histórico familiar
                    </CheckComponent>

                    <CheckComponent
                      checked={checkedAnamnesis.activities}
                      onCheckedChange={(value) =>
                        handleSetCheckedAnamnesis('activities', !!value)
                      }
                    >
                      Atividades que realiza
                    </CheckComponent>

                    <CheckComponent
                      checked={checkedAnamnesis.smoke}
                      onCheckedChange={(value) =>
                        handleSetCheckedAnamnesis('smoke', !!value)
                      }
                    >
                      Fuma
                    </CheckComponent>

                    <CheckComponent
                      checked={checkedAnamnesis.medicines}
                      onCheckedChange={(value) =>
                        handleSetCheckedAnamnesis('medicines', !!value)
                      }
                    >
                      Medicamentos
                    </CheckComponent>

                    <CheckComponent
                      checked={checkedAnamnesis.surgeries}
                      onCheckedChange={(value) =>
                        handleSetCheckedAnamnesis('surgeries', !!value)
                      }
                    >
                      Cirurgias
                    </CheckComponent>
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>

            <Accordion.Root>
              <Accordion.Item>
                <Accordion.Trigger>
                  <CheckAllGroup
                    isChecked={everyCheckedDiagnostic}
                    onClick={toggleCheckedEveryDiagnostic}
                  >
                    Diagnóstico
                  </CheckAllGroup>
                </Accordion.Trigger>

                <Accordion.Content>
                  <div className="ml-6">
                    <CheckComponent
                      checked={checkedDiagnostic.diagnostic}
                      onCheckedChange={(value) =>
                        handleSetCheckedDiagnostic('diagnostic', !!value)
                      }
                    >
                      Diagnóstico
                    </CheckComponent>

                    <CheckComponent
                      checked={checkedDiagnostic.treatmentPlan}
                      onCheckedChange={(value) =>
                        handleSetCheckedDiagnostic('treatmentPlan', !!value)
                      }
                    >
                      Plano de tratamento
                    </CheckComponent>
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>

            <div className="mt-4 flex w-full justify-stretch gap-2">
              <Button
                className="w-full"
                onClick={async () => {
                  await generatePatientPDF({
                    patientId: 'e372ed46-8fb6-4914-8925-8a6bb1b84548',
                    patientData: checkedPatientData,
                    anamnesisData: checkedAnamnesis,
                    diagnosticData: checkedDiagnostic,
                    locationData: checkedLocation,
                  })
                }}
              >
                Gerar PDF
              </Button>
            </div>
          </div>
        </Modal>
      </>
    )
  },
)
