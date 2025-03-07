'use client'

import { Input } from '@/components/input'
import { Validate } from '@/services/api/Validate'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import useSnackbarContext from '@/hooks/useSnackbarContext'
import { responseError } from '@/services/api/api'
import { z } from 'zod'
import { sectionStyles } from '../form/Styles'
import Form, { FormProps } from '../form/Form'
import { MessageResponse } from '@/services/message/message'
import { Switch } from '../ui/switch'
import Button from '../Button'

export const setMessageSchema = z.object({
  name: z.string().min(1, 'Campo obrigatório'),
  active: z.boolean(),
  templateMessage: z.string(),
  initialDate: z.string().optional(),
  endDate: z.string().optional(),
})

export type setMessageData = z.infer<typeof setMessageSchema>

type MessageFormProps = {
  action(
    data: MessageResponse | setMessageData,
  ): Promise<MessageResponse | responseError>
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

  const setMessageForm = useForm<setMessageData>({
    resolver: zodResolver(setMessageSchema),
    defaultValues: {
      active,
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
    })
    if (Validate.isError(res)) {
      handleMessage({ title: 'Erro!', description: res.message, type: 'error' })
    } else {
      reset({ ...data }, { keepValues: true })
      if (afterValidation) afterValidation()
      handleMessage({
        title: 'Serviço salvo com sucesso!',
        type: 'success',
      })
    }
  }

  return (
    <Form onSubmit={handleSubmit(setMessage)} {...formProps}>
      <section
        aria-label="Novo registro Messageiro"
        className={sectionStyles()}
      >
        <Input.Root>
          <Input.Label required notSave={dirtyFields.name}>
            Nome
          </Input.Label>
          <Input.Field
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

        <Input.Root>
          <Input.Label required notSave={dirtyFields.templateMessage}>
            Template da mensagem
          </Input.Label>
          <Input.Field
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

        <button className="text-main">+ Adicionar Template</button>

        <Input.Root>
          <Input.Label>Enviar quando</Input.Label>
          <Input.Select>
            <Input.Option value={'opcção'}>Opção 1</Input.Option>
          </Input.Select>
        </Input.Root>

        <Input.Root>
          <Input.Label>Permitir envio para</Input.Label>
          <Input.Select>
            <Input.Option value={'opcção'}>Opção 1</Input.Option>
          </Input.Select>
        </Input.Root>
      </section>
    </Form>
  )
}
