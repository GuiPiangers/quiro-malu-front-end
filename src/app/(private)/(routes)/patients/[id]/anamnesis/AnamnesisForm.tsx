'use client'

import { Input } from '@/components/formField'
import RadioButton from '@/components/radioButton/RadioButton'
import Form from '../../components/Form'
import { sectionStyles } from '../../components/Styles'
import { AnamnesisResponse } from '@/services/patient/PatientService'
import { useState } from 'react'

type AnamnesisFormProps = { formData: AnamnesisResponse }

export default function AnamnesisForm({
  formData: {
    activities,
    currentIllness,
    familiarHistory,
    history,
    mainProblem,
    medicines,
    smoke,
    surgeries,
    underwentSurgery,
    useMedicine,
  },
}: AnamnesisFormProps) {
  const [underwentSurgeryState, setUnderwentSurgeryState] = useState(
    underwentSurgery === 'yes',
  )
  const [useMedicineState, setUseMedicineState] = useState(
    useMedicine === 'yes',
  )
  return (
    <Form>
      <section aria-label="Anamnese do paciente" className={sectionStyles()}>
        <Input.Root>
          <Input.Label>Queixa principal</Input.Label>
          <Input.Field multiline minRows={4} defaultValue={mainProblem} />
        </Input.Root>

        <Input.Root>
          <Input.Label>História e moléstia atual</Input.Label>
          <Input.Field multiline minRows={4} defaultValue={currentIllness} />
        </Input.Root>

        <Input.Root>
          <Input.Label>Histórico e antecedentes</Input.Label>
          <Input.Field multiline minRows={4} defaultValue={history} />
        </Input.Root>

        <Input.Root>
          <Input.Label>Histórico familiar</Input.Label>
          <Input.Field multiline minRows={4} defaultValue={familiarHistory} />
        </Input.Root>

        <Input.Root>
          <Input.Label>Atividades que realiza</Input.Label>
          <Input.Field multiline minRows={4} defaultValue={activities} />
        </Input.Root>

        <div className="grid w-fit grid-cols-[auto_auto_auto] gap-x-4 gap-y-1">
          <p className="col-span-full text-sm font-medium">Fumante?</p>
          <RadioButton
            label="Sim"
            name="smoke"
            defaultChecked={smoke === 'yes'}
          />
          <RadioButton
            label="Não"
            name="smoke"
            defaultChecked={smoke === 'no'}
          />
          <RadioButton
            label="Passivo"
            name="smoke"
            defaultChecked={smoke === 'passive'}
          />
        </div>

        <div className="grid w-fit grid-cols-[auto_auto_auto] gap-x-4 gap-y-1">
          <p className="col-span-full text-sm font-medium">Usa medicamentos?</p>
          <RadioButton
            label="Sim"
            name="use-medicine"
            defaultChecked={useMedicine === 'yes'}
            onClick={() => setUseMedicineState(true)}
          />
          <RadioButton
            label="Não"
            name="use-medicine"
            defaultChecked={useMedicine === 'no'}
            onClick={() => setUseMedicineState(false)}
          />
        </div>

        <Input.Root>
          <Input.Label>Se sim quais?</Input.Label>
          <Input.Field
            multiline
            minRows={4}
            defaultValue={medicines}
            disabled={!useMedicineState}
          />
        </Input.Root>

        <div className="grid w-fit grid-cols-[auto_auto_auto] gap-x-4 gap-y-1">
          <p className="col-span-full text-sm font-medium">
            Passou por alguma cirurgia?
          </p>
          <RadioButton
            label="Sim"
            name="surgery"
            defaultChecked={underwentSurgery === 'yes'}
            onClick={() => setUnderwentSurgeryState(true)}
          />
          <RadioButton
            label="Não"
            name="surgery"
            defaultChecked={underwentSurgery === 'no'}
            onClick={() => setUnderwentSurgeryState(false)}
          />
        </div>

        <Input.Root>
          <Input.Label>Se sim quais?</Input.Label>
          <Input.Field
            multiline
            minRows={4}
            defaultValue={surgeries}
            disabled={!underwentSurgeryState}
          />
        </Input.Root>
      </section>
    </Form>
  )
}
