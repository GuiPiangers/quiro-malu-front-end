'use client'

import { Box } from '@/components/box/Box'
import NoDataFound from '@/components/notFound/NoDataFound'
import SearchInput from '@/components/input/SearchInput'
import { Table } from '@/components/table'
import { Validate } from '@/services/api/Validate'
import {
  ClinicUserListItem,
  listClinicUsers,
  listClinicians,
} from '@/services/clinicUsers/clinicUsers'
import { listRoles, Role } from '@/services/rbac/rbac'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/Button'
import UserListRow from './UserListRow'

type UserListProps = {
  defaultUsers?: ClinicUserListItem[]
  defaultRoles?: Role[]
  defaultClinicianIds?: string[]
}

function normalizeSearch(value: string) {
  return value.trim().toLowerCase()
}

export default function UserList({
  defaultUsers,
  defaultRoles,
  defaultClinicianIds,
}: UserListProps) {
  const searchParams = useSearchParams()
  const search = normalizeSearch(searchParams.get('pesquisa') ?? '')

  const { data: users, isError: usersError } = useQuery({
    queryKey: ['clinicUsers'],
    queryFn: async () => {
      const result = await listClinicUsers()
      if (Validate.isError(result)) throw new Error(result.message)
      return result
    },
    initialData: defaultUsers,
  })

  const { data: roles } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const result = await listRoles()
      if (Validate.isError(result)) throw new Error(result.message)
      return result
    },
    initialData: defaultRoles,
  })

  const { data: clinicianIds } = useQuery({
    queryKey: ['clinicians'],
    queryFn: async () => {
      const result = await listClinicians()
      if (Validate.isError(result)) throw new Error(result.message)
      return result.map((c) => c.id)
    },
    initialData: defaultClinicianIds,
  })

  const roleNameById = useMemo(() => {
    const map = new Map<string, string>()
    roles?.forEach((role) => map.set(role.id, role.name))
    return map
  }, [roles])

  const clinicianIdSet = useMemo(
    () => new Set(clinicianIds ?? []),
    [clinicianIds],
  )

  const filteredUsers = useMemo(() => {
    if (!users) return []
    if (!search) return users
    return users.filter((user) => {
      const haystack = [user.name, user.email, user.phone]
        .join(' ')
        .toLowerCase()
      return haystack.includes(search)
    })
  }, [users, search])

  if (usersError || !users || !roles) {
    return <NoDataFound />
  }

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <Box className="w-full max-w-screen-lg">
        <div className="mb-6 flex flex-col gap-4">
          <p className="text-sm text-slate-600">
            Gerencie usuários e clínicos da clínica. Clique em um usuário para
            ver detalhes ou excluir.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <SearchInput className="flex-1 text-base" searchParam="pesquisa" />
            <Button asChild color="green">
              <Link
                href="/configuracoes/usuarios/criar"
                className="whitespace-nowrap"
              >
                Novo usuário
              </Link>
            </Button>
          </div>
        </div>

        {filteredUsers.length > 0 ? (
          <Table.Root>
            <Table.Row columns={['2fr', '2fr', '1.5fr', '1fr', '1fr']}>
              <Table.Head>Nome</Table.Head>
              <Table.Head>E-mail</Table.Head>
              <Table.Head>Telefone</Table.Head>
              <Table.Head>Função</Table.Head>
              <Table.Head>Tipo</Table.Head>
            </Table.Row>
            {filteredUsers.map((user) => (
              <UserListRow
                key={user.id}
                user={user}
                isClinician={clinicianIdSet.has(user.id)}
                roleName={
                  user.roleId
                    ? roleNameById.get(user.roleId) ?? '—'
                    : 'Sem função'
                }
              />
            ))}
          </Table.Root>
        ) : (
          <p className="py-8 text-center text-sm text-slate-500">
            {search
              ? 'Nenhum usuário encontrado para a busca.'
              : 'Nenhum usuário cadastrado.'}
          </p>
        )}
      </Box>
    </div>
  )
}
