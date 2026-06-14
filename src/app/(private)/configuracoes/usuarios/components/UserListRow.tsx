'use client'

import { Table } from '@/components/table'
import { ClinicUserListItem } from '@/services/user/user'
import { useRouter } from 'next/navigation'

type UserListRowMobileProps = {
  layout: 'mobile'
  user: ClinicUserListItem
}

type UserListRowDesktopProps = {
  layout: 'desktop'
  user: ClinicUserListItem
  roleName: string
  isClinician: boolean
}

type UserListRowProps = UserListRowMobileProps | UserListRowDesktopProps

export default function UserListRow(props: UserListRowProps) {
  const { user, layout } = props
  const router = useRouter()
  const navigate = () => router.push(`/configuracoes/usuarios/${user.id}`)

  if (layout === 'mobile') {
    return (
      <li>
        <div
          role="button"
          tabIndex={0}
          onClick={navigate}
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'Enter') navigate()
          }}
          className="cursor-pointer px-4 py-3 transition-colors hover:bg-slate-50"
        >
          <p className="font-medium text-slate-800">{user.name}</p>
          <p className="mt-0.5 text-sm font-normal text-slate-600">
            {user.email}
          </p>
        </div>
      </li>
    )
  }

  const { roleName, isClinician } = props

  return (
    <Table.Row
      clickable
      columns={['2fr', '2fr', '1.5fr', '1fr', '1fr']}
      handleOnClick={navigate}
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
