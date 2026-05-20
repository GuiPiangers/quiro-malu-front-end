'use client'

import { Box } from '@/components/box/Box'
import NoDataFound from '@/components/notFound/NoDataFound'
import { Table } from '@/components/table'
import { Validate } from '@/services/api/Validate'
import {
  listPermissionCatalog,
  listRoles,
  PermissionCatalogItem,
  Role,
} from '@/services/rbac/rbac'
import { useQuery } from '@tanstack/react-query'
import CreateRoleModal from './CreateRoleModal'
import UpdateRoleModal from './UpdateRoleModal'

type RoleListProps = {
  defaultRoles?: Role[]
  defaultPermissionsCatalog?: PermissionCatalogItem[]
}

export default function RoleList({
  defaultRoles,
  defaultPermissionsCatalog,
}: RoleListProps) {
  const { data: roles, isError: rolesError } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const result = await listRoles()
      if (Validate.isError(result)) {
        throw new Error(result.message)
      }
      return result
    },
    initialData: defaultRoles,
  })

  const { data: permissionsCatalog, isError: catalogError } = useQuery({
    queryKey: ['permissionCatalog'],
    queryFn: async () => {
      const result = await listPermissionCatalog()
      if (Validate.isError(result)) {
        throw new Error(result.message)
      }
      return result
    },
    initialData: defaultPermissionsCatalog,
  })

  if (rolesError || catalogError || !roles || !permissionsCatalog) {
    return <NoDataFound />
  }

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <Box className="w-full max-w-screen-lg">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600">
            Defina funções e permissões para os usuários da clínica. Papéis do
            sistema não podem ser editados ou excluídos.
          </p>
          <CreateRoleModal permissionsCatalog={permissionsCatalog}>
            Nova função
          </CreateRoleModal>
        </div>

        {roles.length > 0 ? (
          <Table.Root>
            <Table.Row columns={['2fr', '2fr', '1fr']}>
              <Table.Head>Nome</Table.Head>
              <Table.Head>Descrição</Table.Head>
              <Table.Head>Tipo</Table.Head>
            </Table.Row>
            {roles.map((role) => (
              <UpdateRoleModal
                key={role.id}
                role={role}
                permissionsCatalog={permissionsCatalog}
              />
            ))}
          </Table.Root>
        ) : (
          <p className="py-8 text-center text-sm text-slate-500">
            Nenhuma função cadastrada.
          </p>
        )}
      </Box>
    </div>
  )
}
