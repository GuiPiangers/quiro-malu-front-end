import RoleList from '@/app/(private)/configuracoes/funcoes/components/RoleList'
import { Validate } from '@/services/api/Validate'
import { listPermissionCatalog, listRoles } from '@/services/rbac/rbac'

export default async function FuncoesPage() {
  const [rolesRes, catalogRes] = await Promise.all([
    listRoles(),
    listPermissionCatalog(),
  ])

  const defaultRoles = Validate.isOk(rolesRes) ? rolesRes : undefined
  const defaultPermissionsCatalog = Validate.isOk(catalogRes)
    ? catalogRes
    : undefined

  return (
    <RoleList
      defaultRoles={defaultRoles}
      defaultPermissionsCatalog={defaultPermissionsCatalog}
    />
  )
}
