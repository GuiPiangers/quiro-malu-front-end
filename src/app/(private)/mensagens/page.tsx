import Link from 'next/link'
import {
  Clock,
  Cake,
  CalendarCheck,
  CalendarClock,
  ArrowRight,
} from 'lucide-react'
import WhatsAppConnectionCard from './components/WhatsAppConnectionCard'
import { Validate } from '@/services/api/Validate'
import {
  getWhatsAppStatus,
  type WhatsAppConnectionStatus,
} from '@/services/whatsapp/whatsapp'
import { Box } from '@/components/box/Box'

type TemplateCard = {
  icon: React.ReactNode
  title: string
  description: string
  available: boolean
  href?: string
}

const templateCards: TemplateCard[] = [
  {
    icon: <Clock className="h-6 w-6 text-main" />,
    title: 'Mensagem antes de agendamento',
    description:
      'Envie lembretes automáticos para pacientes antes de suas consultas agendadas.',
    available: true,
    href: '/mensagens/templates/antes-do-agendamento',
  },
  {
    icon: <Cake className="h-6 w-6 text-main" />,
    title: 'Mensagem de aniversário',
    description:
      'Parabenize seus pacientes automaticamente no dia do aniversário.',
    available: true,
    href: '/mensagens/templates/aniversario',
  },
  {
    icon: <CalendarCheck className="h-6 w-6 text-main" />,
    title: 'Mensagem após agendamento',
    description:
      'Envie confirmações e informações após o paciente agendar uma consulta.',
    available: true,
    href: '/mensagens/templates/depois-do-agendamento',
  },
  {
    icon: <CalendarClock className="h-6 w-6 text-slate-400" />,
    title: 'Mensagem em data específica',
    description: 'Programe mensagens para serem enviadas em datas específicas.',
    available: false,
  },
]

export default async function MessageTemplatesPage() {
  const statusRes = await getWhatsAppStatus()
  const initialStatus: WhatsAppConnectionStatus =
    Validate.isOk(statusRes) && 'status' in statusRes
      ? statusRes.status
      : 'NOT_REGISTERED'

  return (
    <div className="w-full max-w-screen-lg space-y-6">
      <WhatsAppConnectionCard initialStatus={initialStatus} />

      <div className="grid gap-4 sm:grid-cols-2">
        {templateCards.map((card) => (
          <Box
            key={card.title}
            className={`relative cursor-pointer transition ${
              card.available
                ? 'border-slate-200 hover:border-main hover:shadow-md'
                : 'border-slate-200 opacity-70'
            }`}
          >
            {/* Badge */}
            <div className="absolute right-4 top-4">
              {card.available ? (
                <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                  Disponível
                </span>
              ) : (
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
                  Em breve
                </span>
              )}
            </div>

            {/* Icon */}
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                card.available ? 'bg-purple-50' : 'bg-slate-50'
              }`}
            >
              {card.icon}
            </div>

            {/* Content */}
            <div className="flex flex-col gap-1">
              <h2
                className={`font-semibold ${
                  card.available ? 'text-slate-800' : 'text-slate-600'
                }`}
              >
                {card.title}
              </h2>
              <p className="text-sm text-slate-500">{card.description}</p>
            </div>

            {/* Action */}
            {card.available && card.href ? (
              <Link
                href={card.href}
                className="mt-1 flex w-fit items-center gap-1 text-sm font-medium text-main hover:underline"
              >
                Configurar <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <p className="mt-1 text-sm text-slate-400">Em desenvolvimento</p>
            )}
          </Box>
        ))}
      </div>
    </div>
  )
}
