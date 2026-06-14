import UserDetail from '@/app/(private)/configuracoes/usuarios/components/UserDetail'
import { Validate } from '@/services/api/Validate'
import { getClinicUser } from '@/services/user/user'
import { listRoles } from '@/services/rbac/rbac'
import { notFound } from 'next/navigation'

type UserPageProps = {
  params: { id: string }
}

export default async function UserPage({ params }: UserPageProps) {
  const [detailRes, rolesRes] = await Promise.all([
    getClinicUser(params.id),
    listRoles(),
  ])

  if (Validate.isError(detailRes)) {
    notFound()
  }

  const defaultRoles = Validate.isOk(rolesRes) ? rolesRes : []

  return <UserDetail detail={detailRes} defaultRoles={defaultRoles} />
}
