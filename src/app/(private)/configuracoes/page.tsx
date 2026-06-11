import { Box } from '@/components/box/Box'
import { hasModuleAccess, PermissionModule } from '@/lib/permissions'
import { getSession } from '@/lib/session'
import Link from 'next/link'

const settingsLinks: {
  href: string
  title: string
  description: string
  modulePermission?: PermissionModule
}[] = [
  {
    href: '/configuracoes/usuarios',
    title: 'Usuários da clínica',
    description:
      'Cadastre usuários e clínicos, consulte detalhes e remova acessos da clínica.',
    modulePermission: 'users',
  },
  {
    href: '/configuracoes/funcoes',
    title: 'Funções e permissões',
    description:
      'Crie papéis personalizados e defina o que cada usuário pode acessar na clínica.',
    modulePermission: 'users',
  },
  {
    href: '/configuracoes/calendario',
    title: 'Horários da agenda',
    description:
      'Configure dias de atendimento, intervalos e incrementos do calendário.',
  },
  {
    href: '/configuracoes/importar-pacientes',
    title: 'Importar pacientes',
    description: 'Importe pacientes da clínica.',
    modulePermission: 'patients:write',
  },
]

export default function ConfiguracoesPage() {
  const session = getSession()

  return (
    <div className="flex w-full max-w-screen-lg flex-col gap-4">
      <p className="text-sm text-slate-600">
        Ajustes gerais da clínica. Escolha uma seção para continuar.
      </p>
      <ul className="flex flex-col gap-4">
        {settingsLinks.map((item) => {
          const permission =
            item.modulePermission && session?.permissions
              ? hasModuleAccess(session?.permissions, item.modulePermission)
              : true

          if (!permission) return null

          return (
            <li key={item.href}>
              <Link href={item.href} className="block h-full">
                <Box className="h-full transition-colors hover:border-main hover:bg-slate-50">
                  <h2 className="text-lg font-semibold text-main">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-sm text-slate-600">
                    {item.description}
                  </p>
                </Box>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
