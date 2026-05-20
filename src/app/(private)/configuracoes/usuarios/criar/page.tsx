import CreateClinicUser from '@/app/(private)/configuracoes/usuarios/components/CreateClinicUser'
import { Validate } from '@/services/api/Validate'
import { listRoles } from '@/services/rbac/rbac'

export default async function CriarUsuarioPage() {
  const rolesRes = await listRoles()
  const defaultRoles = Validate.isOk(rolesRes) ? rolesRes : []

  return <CreateClinicUser defaultRoles={defaultRoles} />
}
