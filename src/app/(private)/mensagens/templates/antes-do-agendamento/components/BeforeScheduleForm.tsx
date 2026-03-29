'use client'

import { Input } from '@/components/input'
import { Validate } from '@/services/api/Validate'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import useSnackbarContext from '@/hooks/useSnackbarContext'
import { z } from 'zod'
import { Switch } from '@/components/ui/switch'
import {
  BeforeScheduleMessageResponse,
  createBeforeScheduleMessage,
  updateBeforeScheduleMessage,
} from '@/services/message/message'
import { Copy, User, Phone, Calendar, Clock, Stethoscope } from 'lucide-react'
import { useState } from 'react'
import Button from '@/components/Button'

// ── Schema ────────────────────────────────────────────────────────────────────

const schema = z.object({
  name: z.string().min(1, 'Campo obrigatório'),
  templateMessage: z.string().min(1, 'Campo obrigatório'),
  active: z.boolean(),
})

type FormData = z.infer<typeof schema>

// ── Available variables ───────────────────────────────────────────────────────

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
    key: '{{data_agendamento}}',
    label: '{{data_agendamento}}',
    icon: <Calendar className="h-3.5 w-3.5" />,
    sample: '29/03/2026',
  },
  {
    key: '{{hora_agendamento}}',
    label: '{{hora_agendamento}}',
    icon: <Clock className="h-3.5 w-3.5" />,
    sample: '10:00',
  },
  {
    key: '{{nome_servico}}',
    label: '{{nome_servico}}',
    icon: <Stethoscope className="h-3.5 w-3.5" />,
    sample: 'Quiropraxia',
  },
  {
    key: '{{nome_profissional}}',
    label: '{{nome_profissional}}',
    icon: <User className="h-3.5 w-3.5" />,
    sample: 'Dra. Malu',
  },
]

// ── Preview renderer ──────────────────────────────────────────────────────────

function renderPreview(template: string): string {
  let result = template
  for (const { key, sample } of VARIABLES) {
    result = result.split(key).join(sample)
  }
  return result
}

/** Renders WhatsApp-style *bold* markdown */
function WhatsAppText({ text }: { text: string }) {
  const parts = text.split(/(\*[^*]+\*)/)
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('*') && part.endsWith('*') ? (
          <strong key={i}>{part.slice(1, -1)}</strong>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

type BeforeScheduleFormProps = {
  defaultValues?: Partial<BeforeScheduleMessageResponse>
}

export default function BeforeScheduleForm({
  defaultValues,
}: BeforeScheduleFormProps) {
  const { handleMessage } = useSnackbarContext()
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

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
    },
  })

  const templateMessage = useWatch({ control, name: 'templateMessage' })
  const isActive = useWatch({ control, name: 'active' })

  const onSubmit = async (data: FormData) => {
    const payload: BeforeScheduleMessageResponse = {
      ...defaultValues,
      ...data,
    }

    const res = defaultValues?.id
      ? await updateBeforeScheduleMessage(defaultValues.id, payload)
      : await createBeforeScheduleMessage(payload)

    if (Validate.isError(res)) {
      handleMessage({ title: 'Erro!', description: res.message, type: 'error' })
    } else {
      handleMessage({
        title: 'Template salvo com sucesso!',
        type: 'success',
      })
    }
  }

  const copyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 1500)
  }

  const previewLines = renderPreview(templateMessage ?? '').split('\n')

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid w-full max-w-screen-lg gap-6 lg:grid-cols-[1fr_360px]"
    >
      {/* ── Left column ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        {/* Section: Dados do Template */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
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
                Quando ativo, as mensagens serão enviadas automaticamente
              </p>
            </div>
            <Switch
              checked={isActive}
              onCheckedChange={(val) => setValue('active', val)}
              className="data-[state=checked]:bg-main"
            />
          </div>
        </div>

        {/* Section: Conteúdo do Template */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
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
            <Input.Field
              multiline
              minRows={7}
              placeholder={`Ex. Olá {{nome_paciente}}! 👋\n\nEste é um lembrete da sua consulta agendada para *{{data_agendamento}}* às *{{hora_agendamento}}*.`}
              autoComplete="off"
              disabled={isSubmitting}
              error={!!errors.templateMessage}
              notSave={dirtyFields.templateMessage}
              {...register('templateMessage')}
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
              Clique em uma variável para copiá-la. Use{' '}
              <span className="font-mono">*texto*</span> para negrito no
              WhatsApp.
            </p>
          </div>
        </div>
      </div>

      {/* ── Right column: Preview ────────────────────────────────── */}
      <div className="flex flex-col gap-4">
        <div className="sticky top-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-1 flex items-center gap-2 text-lg font-semibold text-main">
            <span>👁️</span> Pré-visualização
          </h2>
          <p className="mb-5 text-sm text-slate-500">
            Veja como a mensagem ficará para o paciente
          </p>

          {/* WhatsApp bubble */}
          <div className="rounded-xl bg-[#ECE5DD] p-4">
            <div className="relative max-w-xs rounded-lg rounded-tl-none bg-white px-4 py-3 shadow-sm">
              <p className="whitespace-pre-wrap break-words text-sm text-slate-800 leading-relaxed">
                {previewLines.length > 0 && previewLines[0] !== '' ? (
                  previewLines.map((line, i) => (
                    <span key={i}>
                      <WhatsAppText text={line} />
                      {i < previewLines.length - 1 && <br />}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-400">
                    Digite sua mensagem para visualizar a pré-visualização...
                  </span>
                )}
              </p>
              <p className="mt-1 text-right text-[10px] text-slate-400">
                14:30
              </p>
            </div>
          </div>

          <p className="mt-2 text-center text-xs text-slate-400">
            Exemplo com dados fictícios
          </p>
        </div>
      </div>

      {/* ── Save button ──────────────────────────────────────────── */}
      <div className="lg:col-span-2">
        <div className="flex rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <Button
            type="submit"
            color="green"
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            Salvar
          </Button>
        </div>
      </div>
    </form>
  )
}
