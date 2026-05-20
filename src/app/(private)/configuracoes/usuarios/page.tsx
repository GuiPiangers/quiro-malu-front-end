import UserList from '@/app/(private)/configuracoes/usuarios/components/UserList'
import { Validate } from '@/services/api/Validate'
import { listClinicUsers, listClinicians } from '@/services/clinicUsers/clinicUsers'
import { listRoles } from '@/services/rbac/rbac'

export default async function UsuariosPage() {
  const [usersRes, rolesRes, cliniciansRes] = await Promise.all([
    listClinicUsers(),
    listRoles(),
    listClinicians(),
  ])

  const defaultUsers = Validate.isOk(usersRes) ? usersRes : undefined
  const defaultRoles = Validate.isOk(rolesRes) ? rolesRes : undefined
  const defaultClinicianIds = Validate.isOk(cliniciansRes)
    ? cliniciansRes.map((c) => c.id)
    : undefined

  return (
    <UserList
      defaultUsers={defaultUsers}
      defaultRoles={defaultRoles}
      defaultClinicianIds={defaultClinicianIds}
    />
  )
}
