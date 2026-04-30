'use client'

import { Input } from '@/components/input'
import { Validate } from '@/services/api/Validate'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm, useWatch } from 'react-hook-form'
import useSnackbarContext from '@/hooks/useSnackbarContext'
import { z } from 'zod'
import { Switch } from '@/components/ui/switch'
import {
  createAfterScheduleMessage,
  updateAfterScheduleMessage,
} from '@/services/message/afterScheduleMessage'
import {
  bindSendListCampaigns,
  unbindSendListCampaign,
} from '@/services/message/sendList'
import type { AfterScheduleMessageResponse } from '@/services/message/afterScheduleMessageTypes'
import {
  Copy,
  User,
  Phone,
  Calendar,
  Clock,
  Stethoscope,
  Users,
  ListChecks,
} from 'lucide-react'
import { useState } from 'react'
import Button from '@/components/Button'
import { BraceAutocompleteTextarea } from '@/components/brace-autocomplete'
import { WhatsAppMessageBubble } from '@/components/message/WhatsAppMessageBubble'
import { useRouter } from 'next/navigation'
import { Box } from '@/components/box/Box'
import MessageTemplateSendListPicker, {
  type SendListSelection,
} from '@/app/(private)/mensagens/components/MessageTemplateSendListPicker'

// ── Schema ────────────────────────────────────────────────────────────────────

const TIME_UNITS = ['minutes', 'hours', 'days'] as const
type TimeUnit = (typeof TIME_UNITS)[number]

const UNIT_MULTIPLIER: Record<TimeUnit, number> = {
  minutes: 1,
  hours: 60,
  days: 1440,
}

const UNIT_LABELS: Record<TimeUnit, string> = {
  minutes: 'minutos',
  hours: 'horas',
  days: 'dias',
}

function deriveTimeFields(minutes?: number): {
  timeValue: number
  timeUnit: TimeUnit
} {
  if (!minutes) return { timeValue: 24, timeUnit: 'hours' }
  if (minutes % 1440 === 0)
    return { timeValue: minutes / 1440, timeUnit: 'days' }
  if (minutes % 60 === 0) return { timeValue: minutes / 60, timeUnit: 'hours' }
  return { timeValue: minutes, timeUnit: 'minutes' }
}

const schema = z.object({
  name: z.string().min(1, 'Campo obrigatório'),
  templateMessage: z.string().min(1, 'Campo obrigatório'),
  active: z.boolean(),
  timeValue: z
    .number({ invalid_type_error: 'Campo obrigatório' })
    .min(1, 'Deve ser maior que 0'),
  timeUnit: z.enum(TIME_UNITS),
})

type FormData = z.infer<typeof schema>

// ── Available variables ───────────────────────────────────────────────────────

const VARIABLES = [
  {
    key: '{{nome_paciente}}',
    label: '{{nome_paciente}}',
    icon: <User className="h-3.5 w-3.5" />,
    sample: 'Maria',
  },
  {
    key: '{{nome_completo_paciente}}',
    label: '{{nome_completo_paciente}}',
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
    key: '{{genero_paciente}}',
    label: '{{genero_paciente}}',
    icon: <Users className="h-3.5 w-3.5" />,
    sample: 'Feminino',
  },
  {
    key: '{{data_consulta}}',
    label: '{{data_consulta}}',
    icon: <Calendar className="h-3.5 w-3.5" />,
    sample: '29/03/2026',
  },
  {
    key: '{{horario_consulta}}',
    label: '{{horario_consulta}}',
    icon: <Clock className="h-3.5 w-3.5" />,
    sample: '10:00',
  },
  {
    key: '{{servico_consulta}}',
    label: '{{servico_consulta}}',
    icon: <Stethoscope className="h-3.5 w-3.5" />,
    sample: 'Quiropraxia',
  },
  {
    key: '{{status_consulta}}',
    label: '{{status_consulta}}',
    icon: <ListChecks className="h-3.5 w-3.5" />,
    sample: 'Confirmada',
  },
]

const TEMPLATE_VARIABLE_OPTIONS = VARIABLES.map(({ key, label }) => ({
  value: key,
  label,
}))

// ── Preview renderer ──────────────────────────────────────────────────────────

function renderPreview(template: string): string {
  let result = template
  for (const { key, sample } of VARIABLES) {
    result = result.split(key).join(sample)
  }
  return result
}

// ── Component ─────────────────────────────────────────────────────────────────

type AfterScheduleFormProps = {
  defaultValues?: Partial<AfterScheduleMessageResponse>
  initialLinkedSendList?: SendListSelection | null
}

export default function AfterScheduleForm({
  defaultValues,
  initialLinkedSendList = null,
}: AfterScheduleFormProps) {
  const { handleMessage } = useSnackbarContext()
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [sendList, setSendList] = useState<SendListSelection | null>(
    initialLinkedSendList,
  )
  const router = useRouter()

  const { timeValue: defaultTimeValue, timeUnit: defaultTimeUnit } =
    deriveTimeFields(defaultValues?.minutesAfterSchedule)

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
      timeValue: defaultTimeValue,
      timeUnit: defaultTimeUnit,
    },
  })

  const templateMessage = useWatch({ control, name: 'templateMessage' })
  const isActive = useWatch({ control, name: 'active' })

  const onSubmit = async (data: FormData) => {
    const minutesAfterSchedule = data.timeValue * UNIT_MULTIPLIER[data.timeUnit]

    const payload: AfterScheduleMessageResponse = {
      ...defaultValues,
      name: data.name,
      templateMessage: data.templateMessage,
      active: data.active,
      minutesAfterSchedule,
    }

    const res = defaultValues?.id
      ? await updateAfterScheduleMessage(defaultValues.id, payload)
      : await createAfterScheduleMessage(payload)

    if (Validate.isError(res)) {
      handleMessage({ title: 'Erro!', description: res.message, type: 'error' })
      return
    }

    const campaignId = res.id ?? defaultValues?.id
    if (sendList) {
      if (!campaignId) {
        handleMessage({
          title: 'Erro!',
          description:
            'Template salvo, mas não foi possível obter o identificador da campanha para vincular a lista.',
          type: 'error',
        })
        return
      }
      const bindRes = await bindSendListCampaigns(sendList.id, [campaignId])
      if (Validate.isError(bindRes)) {
        handleMessage({
          title: 'Erro ao vincular lista',
          description: bindRes.message,
          type: 'error',
        })
        return
      }
    } else if (campaignId) {
      const unbindRes = await unbindSendListCampaign(campaignId)
      if (Validate.isError(unbindRes)) {
        handleMessage({
          title: 'Erro ao remover vínculo da lista',
          description: unbindRes.message,
          type: 'error',
        })
        return
      }
    }

    handleMessage({
      title: 'Template salvo com sucesso!',
      type: 'success',
    })
    router.push('/mensagens/templates/depois-do-agendamento')
    router.refresh()
  }

  const copyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 1500)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid w-full max-w-screen-lg gap-6 lg:grid-cols-[1fr_360px]"
    >
      {/* ── Left column ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        {/* Section: Dados do Template */}
        <Box>
          <h2 className="mb-1 text-lg font-semibold text-main">
            Dados do Template
          </h2>
          <p className="mb-5 text-sm text-slate-500">
            Configure o nome e status do template de mensagem
          </p>

          {/* Name */}
          <Input.Root>
            <Input.Label required notSave={dirtyFields.name}>
              Nome
            </Input.Label>
            <Input.Field
              placeholder="Ex. Lembrete de Consulta"
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

          {/* Active toggle */}
          <div className="mt-5 flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div>
              <p className="text-sm font-medium text-slate-700">
                Template ativo
              </p>
              <p className="text-xs text-slate-500">
                Quando ativo, as mensagens serão enviadas automaticamente após a
                consulta ser agendada
              </p>
            </div>
            <Switch
              checked={isActive}
              onCheckedChange={(val) => setValue('active', val)}
              className="data-[state=checked]:bg-main"
            />
          </div>

          {/* Time before schedule */}
          <div className="mt-5">
            <p className="mb-1.5 text-sm font-medium text-slate-700">
              Envio após o agendamento <span className="text-red-500">*</span>
            </p>
            <p className="mb-3 text-xs text-slate-500">
              Quanto tempo após o agendamento a mensagem será disparada
            </p>
            <div className="flex min-w-0 items-start gap-2">
              <div className="w-28 shrink-0">
                <Input.Root className="max-w-full">
                  <Input.Field
                    type="number"
                    min={1}
                    placeholder="Ex. 24"
                    disabled={isSubmitting}
                    error={!!errors.timeValue}
                    notSave={dirtyFields.timeValue}
                    slotProps={{
                      root: {
                        className: 'w-full min-w-0 max-w-full overflow-hidden',
                      },
                      input: {
                        className: 'min-w-0 max-w-full !flex-grow-0 basis-full',
                      },
                    }}
                    {...register('timeValue', { valueAsNumber: true })}
                  />
                </Input.Root>
              </div>
              <select
                disabled={isSubmitting}
                {...register('timeUnit')}
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm focus:border-main focus:outline-none focus:ring-1 focus:ring-main disabled:opacity-50"
              >
                {TIME_UNITS.map((unit) => (
                  <option key={unit} value={unit}>
                    {UNIT_LABELS[unit]}
                  </option>
                ))}
              </select>
              <span className="flex h-10 items-center text-sm text-slate-600">
                após o agendamento
              </span>
            </div>
            {errors.timeValue && (
              <Input.Message error>{errors.timeValue.message}</Input.Message>
            )}
          </div>

          <MessageTemplateSendListPicker
            value={sendList}
            onChange={setSendList}
            disabled={isSubmitting}
          />
        </Box>

        {/* Section: Conteúdo do Template */}
        <Box>
          <h2 className="mb-1 text-lg font-semibold text-main">
            Conteúdo do Template
          </h2>
          <p className="mb-5 text-sm text-slate-500">
            Escreva a mensagem que será enviada aos pacientes. Use as variáveis
            para personalizar.
          </p>

          {/* Template textarea */}
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
                    placeholder={`Ex. Olá {{nome_paciente}}! 👋\n\nLembrete da sua consulta em *{{data_consulta}}* às *{{horario_consulta}}* — {{servico_consulta}} ({{status_consulta}}).`}
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

          {/* Variables panel */}
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

      {/* ── Right column: Preview ────────────────────────────────── */}
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
            timestamp="14:30"
            emptyPlaceholder="Digite sua mensagem para visualizar a pré-visualização..."
          />

          <p className="mt-2 text-center text-xs text-slate-400">
            Exemplo com dados fictícios
          </p>
        </Box>
      </div>

      {/* ── Save button ──────────────────────────────────────────── */}
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
