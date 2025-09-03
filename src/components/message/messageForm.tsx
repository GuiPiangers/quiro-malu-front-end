'use client'

import { Input } from '@/components/input'
import { Validate } from '@/services/api/Validate'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import useSnackbarContext from '@/hooks/useSnackbarContext'
import { z } from 'zod'
import { sectionStyles, titleStyles } from '../form/Styles'
import Form, { FormProps } from '../form/Form'
import { MessageResponse, TriggerDTO } from '@/services/message/message'
import { MessageEventSelect } from './MessageEventSelect'
import { useState } from 'react'

export const setMessageSchema = z.object({
  name: z.string().min(1, 'Campo obrigatório'),
  templateMessage: z.string(),
  initialDate: z.string().optional(),
  endDate: z.string().optional(),
})

export type setMessageData = z.infer<typeof setMessageSchema>

type MessageFormProps = {
  action(data: MessageResponse | setMessageData): Promise<unknown>
  formData?: Partial<MessageResponse>
  afterValidation?(): void
} & FormProps

export default function MessageForm({
  formData,
  afterValidation,
  action,
  ...formProps
}: MessageFormProps) {
  const { active, endDate, id, initialDate, name, templateMessage } =
    formData || {}
  const { handleMessage } = useSnackbarContext()
  const [trigger, setTrigger] = useState<TriggerDTO<any>>({
    event: 'selectedDate',
    config: {},
  })

  const setMessageForm = useForm<setMessageData>({
    resolver: zodResolver(setMessageSchema),
    defaultValues: {
      endDate,
      initialDate,
      name,
      templateMessage,
    },
  })

  const {
    handleSubmit,
    formState: { isSubmitting, errors, dirtyFields },
    register,
    setValue,
    reset,
  } = setMessageForm

  const setMessage = async (data: setMessageData) => {
    const res = await action({
      id,
      ...data,
      triggers: [trigger],
    })
    if (Validate.isError(res)) {
      handleMessage({ title: 'Erro!', description: res.message, type: 'error' })
    } else {
      reset({ ...data }, { keepValues: true })
      if (afterValidation) afterValidation()
      handleMessage({
        title: 'Campanha de mensagem salva com sucesso!',
        type: 'success',
      })
    }
  }

  return (
    <Form onSubmit={handleSubmit(setMessage)} {...formProps}>
      <section
        aria-label="Nova campanha de mensagem"
        className={sectionStyles()}
      >
        <h2 id="new-message-campaign" className={titleStyles()}>
          Nova campanha de mensagens
        </h2>

        <Input.Root>
          <Input.Label required notSave={dirtyFields.name}>
            Nome
          </Input.Label>

          <Input.Field
            placeholder="Ex. Lembrete de consulta"
            autoComplete="off"
            disabled={isSubmitting}
            defaultValue={name}
            error={!!errors.name}
            {...register('name')}
            notSave={dirtyFields.name}
          />
          {errors.name && (
            <Input.Message error>{errors.name.message}</Input.Message>
          )}
        </Input.Root>

        <MessageEventSelect setTrigger={setTrigger} trigger={trigger} />

        <Input.Root>
          <Input.Label required notSave={dirtyFields.templateMessage}>
            Template da mensagem
          </Input.Label>
          <Input.Field
            placeholder="Ex. Bom dia {{nome_paciente}}, estou passando para lembrar da sua consulta de {{consulta_servico}} agendada às {{consulta_horario}} do dia {{consulta_dia}}."
            multiline
            minRows={6}
            autoComplete="off"
            disabled={isSubmitting}
            defaultValue={templateMessage}
            error={!!errors.templateMessage}
            {...register('templateMessage')}
            notSave={dirtyFields.templateMessage}
          />
          {errors.templateMessage && (
            <Input.Message error>
              {errors.templateMessage.message}
            </Input.Message>
          )}
        </Input.Root>
      </section>
    </Form>
  )
}
