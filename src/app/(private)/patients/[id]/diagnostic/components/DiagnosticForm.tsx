'use client'

import { Input } from '@/components/input'
import Form from '../../../../../../components/form/Form'
import { sectionStyles } from '../../../../../../components/form/Styles'
import {
  DiagnosticResponse,
  setDiagnostic,
} from '@/services/patient/actions/patient'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import useSnackbarContext from '@/hooks/useSnackbarContext'
import { Validate } from '@/services/api/Validate'
import { useRouter } from 'next/navigation'
import { ReactNode } from 'react'

const setDiagnosticSchema = z.object({
  diagnostic: z.string().optional(),
  treatmentPlan: z.string().optional(),
})

export type setDiagnosticData = z.infer<typeof setDiagnosticSchema>

type DiagnosticFormProps = {
  formData: Partial<DiagnosticResponse>
  afterValidate?(): void
  buttons?: ReactNode
  btWrapperClassName?: string
}

export default function DiagnosticForm({
  formData: { diagnostic, treatmentPlan, patientId },
  afterValidate,
  btWrapperClassName,
  buttons,
}: DiagnosticFormProps) {
  const { handleMessage: handleOpen } = useSnackbarContext()
  const router = useRouter()
  const setDiagnosticForm = useForm<DiagnosticResponse>({
    resolver: zodResolver(setDiagnosticSchema),
    values: {
      diagnostic,
      treatmentPlan,
      patientId: patientId!,
    },
  })

  const {
    handleSubmit,
    formState: { isSubmitting, errors, dirtyFields },
    register,
    reset,
  } = setDiagnosticForm

  const handleSetDiagnostic = async (data: setDiagnosticData) => {
    const res = await setDiagnostic({
      patientId: patientId!,
      ...data,
    })
    if (Validate.isError(res)) {
      handleOpen({ title: 'Erro!', description: res.message, type: 'error' })
    } else {
      reset({ ...data }, { keepValues: true })
      if (afterValidate) {
        afterValidate()
      } else {
        handleOpen({ title: 'Diagnóstico salvo com sucesso!', type: 'success' })
      }
    }
  }

  return (
    <Form
      onSubmit={handleSubmit(handleSetDiagnostic)}
      buttons={buttons}
      btWrapperClassName={btWrapperClassName}
    >
      <section aria-label="Diagnóstico do paciente" className={sectionStyles()}>
        <Input.Root>
          <Input.Label notSave={dirtyFields.diagnostic}>
            Diagnóstico
          </Input.Label>
          <Input.Field
            multiline
            minRows={4}
            disabled={isSubmitting}
            defaultValue={diagnostic}
            {...register('diagnostic')}
            notSave={dirtyFields.diagnostic}
          />
          {errors.diagnostic && (
            <Input.Message error>{errors.diagnostic.message}</Input.Message>
          )}
        </Input.Root>

        <Input.Root>
          <Input.Label notSave={dirtyFields.treatmentPlan}>
            Plano de tratamento
          </Input.Label>
          <Input.Field
            multiline
            minRows={4}
            disabled={isSubmitting}
            defaultValue={treatmentPlan}
            {...register('treatmentPlan')}
            notSave={dirtyFields.treatmentPlan}
          />
          {errors.treatmentPlan && (
            <Input.Message error>{errors.treatmentPlan.message}</Input.Message>
          )}
        </Input.Root>
      </section>
    </Form>
  )
}
