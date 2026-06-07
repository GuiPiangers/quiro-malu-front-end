import { notFound } from 'next/navigation'
import { hasModuleAccess, PermissionModule } from '@/lib/permissions'
import { getSession } from '@/lib/session'

export function requireModuleAccess(module: PermissionModule): void {
  const session = getSession()

  if (!session || !hasModuleAccess(session.permissions, module)) {
    notFound()
  }
}
