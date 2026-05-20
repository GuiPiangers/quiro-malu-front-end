'use client'

import { Table } from '@/components/table'
import { ClinicUserListItem } from '@/services/clinicUsers/clinicUsers'
import { useRouter } from 'next/navigation'

type UserListRowProps = {
  user: ClinicUserListItem
  roleName: string
  isClinician: boolean
}

export default function UserListRow({
  user,
  roleName,
  isClinician,
}: UserListRowProps) {
  const router = useRouter()

  return (
    <Table.Row
      clickable
      columns={['2fr', '2fr', '1.5fr', '1fr', '1fr']}
      handleOnClick={() => router.push(`/configuracoes/usuarios/${user.id}`)}
    >
      <Table.Cell className="font-medium">{user.name}</Table.Cell>
      <Table.Cell className="text-slate-600">{user.email}</Table.Cell>
      <Table.Cell className="text-slate-600">{user.phone}</Table.Cell>
      <Table.Cell>{roleName}</Table.Cell>
      <Table.Cell>
        <span
          className={
            isClinician
              ? 'rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700'
              : 'rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600'
          }
        >
          {isClinician ? 'Clínico' : 'Usuário'}
        </span>
      </Table.Cell>
    </Table.Row>
  )
}
