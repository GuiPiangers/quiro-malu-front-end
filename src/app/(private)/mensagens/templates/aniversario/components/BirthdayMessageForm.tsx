'use client'

import { Input } from '@/components/input'
import { Validate } from '@/services/api/Validate'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm, useWatch } from 'react-hook-form'
import useSnackbarContext from '@/hooks/useSnackbarContext'
import { z } from 'zod'
import { Switch } from '@/components/ui/switch'
import {
  createBirthdayMessage,
  updateBirthdayMessage,
} from '@/services/message/birthdayMessage'
import type { BirthdayMessageResponse } from '@/services/message/birthdayMessageTypes'
import { DEFAULT_BIRTHDAY_SEND_TIME } from '@/services/message/birthdayMessageConstants'
import { Copy, User, Phone, Calendar } from 'lucide-react'
import { useState } from 'react'
import Button from '@/components/Button'
import { BraceAutocompleteTextarea } from '@/components/brace-autocomplete'
import { WhatsAppMessageBubble } from '@/components/message/WhatsAppMessageBubble'
import { useRouter } from 'next/navigation'
import { Box } from '@/components/box/Box'

const schema = z.object({
  name: z.string().min(1, 'Campo obrigatório'),
  templateMessage: z.string().min(1, 'Campo obrigatório'),
  active: z.boolean(),
  sendTime: z.string().min(1, 'Campo obrigatório'),
})

type FormData = z.infer<typeof schema>

const VARIABLES = [
  {
    key: '{{nome_paciente}}',
    label: '{{nome_paciente}}',
    icon: <User className="h-3.5 w-3.5" />,
    sample: 'Maria Silva',
  },
  {
    key: '{{telefone_paciente}}',
    label: '{{telefone_paciente}}',
    icon: <Phone className="h-3.5 w-3.5" />,
    sample: '(11) 99999-9999',
  },
  {
    key: '{{data_aniversario}}',
    label: '{{data_aniversario}}',
    icon: <Calendar className="h-3.5 w-3.5" />,
    sample: '15/08',
  },
]

const TEMPLATE_VARIABLE_OPTIONS = VARIABLES.map(({ key, label }) => ({
  value: key,
  label,
}))

function renderPreview(template: string): string {
  let result = template
  for (const { key, sample } of VARIABLES) {
    result = result.split(key).join(sample)
  }
  return result
}

type BirthdayMessageFormProps = {
  defaultValues?: Partial<BirthdayMessageResponse>
}

export default function BirthdayMessageForm({
  defaultValues,
}: BirthdayMessageFormProps) {
  const { handleMessage } = useSnackbarContext()
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const router = useRouter()

  const {
    handleSubmit,
    register,
    control,
    setValue,
    formState: { isSubmitting, errors, dirtyFields },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      templateMessage: defaultValues?.templateMessage ?? '',
      active: defaultValues?.active ?? true,
      sendTime: defaultValues?.sendTime ?? DEFAULT_BIRTHDAY_SEND_TIME,
    },
  })

  const templateMessage = useWatch({ control, name: 'templateMessage' })
  const isActive = useWatch({ control, name: 'active' })
  const sendTime = useWatch({ control, name: 'sendTime' })

  const onSubmit = async (data: FormData) => {
    const payload: BirthdayMessageResponse = {
      ...defaultValues,
      name: data.name,
      templateMessage: data.templateMessage,
      active: data.active,
      sendTime: data.sendTime,
    }

    const res = defaultValues?.id
      ? await updateBirthdayMessage(defaultValues.id, payload)
      : await createBirthdayMessage(payload)

    if (Validate.isError(res)) {
      handleMessage({ title: 'Erro!', description: res.message, type: 'error' })
    } else {
      handleMessage({
        title: 'Template salvo com sucesso!',
        type: 'success',
      })
      router.push('/mensagens/templates/aniversario')
      router.refresh()
    }
  }

  const copyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 1500)
  }

  const previewClock =
    sendTime && /^\d{2}:\d{2}$/.test(sendTime)
      ? sendTime
      : DEFAULT_BIRTHDAY_SEND_TIME

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid w-full max-w-screen-lg gap-6 lg:grid-cols-[1fr_360px]"
    >
      <div className="flex flex-col gap-6">
        <Box>
          <h2 className="mb-1 text-lg font-semibold text-main">
            Dados do Template
          </h2>
          <p className="mb-5 text-sm text-slate-500">
            Configure o nome, horário de envio no dia do aniversário e o status
          </p>

          <Input.Root>
            <Input.Label required notSave={dirtyFields.name}>
              Nome
            </Input.Label>
            <Input.Field
              placeholder="Ex. Parabéns pelo seu dia"
              autoComplete="off"
              disabled={isSubmitting}
              error={!!errors.name}
              notSave={dirtyFields.name}
              {...register('name')}
            />
            {errors.name && (
              <Input.Message error>{errors.name.message}</Input.Message>
            )}
          </Input.Root>

          <div className="mt-5 flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div>
              <p className="text-sm font-medium text-slate-700">
                Template ativo
              </p>
              <p className="text-xs text-slate-500">
                Quando ativo, a mensagem será enviada automaticamente no dia do
                aniversário do paciente
              </p>
            </div>
            <Switch
              checked={isActive}
              onCheckedChange={(val) => setValue('active', val)}
              className="data-[state=checked]:bg-main"
            />
          </div>

          <div className="mt-5">
            <Input.Root>
              <Input.Label required notSave={dirtyFields.sendTime}>
                Horário de envio
              </Input.Label>
              <p className="mb-2 text-xs text-slate-500">
                Horário no dia do aniversário em que a mensagem será disparada
                (padrão 09:00)
              </p>
              <Input.Field
                type="time"
                disabled={isSubmitting}
                error={!!errors.sendTime}
                notSave={dirtyFields.sendTime}
                {...register('sendTime')}
              />
              {errors.sendTime && (
                <Input.Message error>{errors.sendTime.message}</Input.Message>
              )}
            </Input.Root>
          </div>
        </Box>

        <Box>
          <h2 className="mb-1 text-lg font-semibold text-main">
            Conteúdo do Template
          </h2>
          <p className="mb-5 text-sm text-slate-500">
            Escreva a mensagem de aniversário. Use as variáveis para
            personalizar.
          </p>

          <Input.Root>
            <Input.Label required notSave={dirtyFields.templateMessage}>
              Mensagem
            </Input.Label>
            <Controller
              name="templateMessage"
              control={control}
              render={({ field }) => {
                const { ref, ...fieldProps } = field
                return (
                  <BraceAutocompleteTextarea
                    {...fieldProps}
                    options={TEMPLATE_VARIABLE_OPTIONS}
                    minRows={7}
                    placeholder={`Ex. Feliz aniversário, {{nome_paciente}}! 🎂\n\nSeu dia especial é *{{data_aniversario}}* — {{telefone_paciente}}.`}
                    autoComplete="off"
                    disabled={isSubmitting}
                    error={!!errors.templateMessage}
                    notSave={dirtyFields.templateMessage}
                    slotProps={{
                      input: { ref },
                    }}
                  />
                )
              }}
            />
            {errors.templateMessage && (
              <Input.Message error>
                {errors.templateMessage.message}
              </Input.Message>
            )}
          </Input.Root>

          <div className="mt-4 rounded-lg border border-purple-100 bg-purple-50 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-main">
              Variáveis disponíveis
            </p>
            <div className="grid grid-cols-2 gap-2">
              {VARIABLES.map(({ key, label, icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => copyToClipboard(key)}
                  className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-xs text-slate-600 transition hover:border-main hover:text-main"
                >
                  <span className="flex items-center gap-1.5">
                    {icon}
                    <span className="font-mono">{label}</span>
                  </span>
                  <Copy
                    className={`h-3.5 w-3.5 shrink-0 transition ${
                      copiedKey === key ? 'text-green-500' : 'text-slate-400'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-slate-400">
              Digite <span className="font-mono">{'{{'}</span> na mensagem para
              sugerir variáveis, ou clique para copiar. Use{' '}
              <span className="font-mono">*texto*</span> para negrito no
              WhatsApp.
            </p>
          </div>
        </Box>
      </div>

      <div className="flex flex-col gap-4">
        <Box className="sticky top-4">
          <h2 className="mb-1 flex items-center gap-2 text-lg font-semibold text-main">
            Pré-visualização
          </h2>
          <p className="mb-5 text-sm text-slate-500">
            Veja como a mensagem ficará para o paciente
          </p>

          <WhatsAppMessageBubble
            text={renderPreview(templateMessage ?? '')}
            timestamp={previewClock}
            emptyPlaceholder="Digite sua mensagem para visualizar a pré-visualização..."
          />

          <p className="mt-2 text-center text-xs text-slate-400">
            Exemplo com dados fictícios
          </p>
        </Box>
      </div>

      <div className="lg:col-span-2">
        <Box>
          <Button
            type="submit"
            color="green"
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            Salvar
          </Button>
        </Box>
      </div>
    </form>
  )
}
