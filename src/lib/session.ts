import { cookies } from 'next/headers'
import {
  decodeJwtPayload,
  parseJwtPermissions,
} from '@/lib/jwt/decodeJwtPayload'
import { ResolvedPermission } from '@/types/permissions'

export const ACCESS_TOKEN_COOKIE = 'quiro-token'

export type SessionPayload = {
  userId: string
  clinicId: string
  permissions: ResolvedPermission[]
}

export function getSession(): SessionPayload | null {
  const token = cookies().get(ACCESS_TOKEN_COOKIE)?.value
  if (!token) return null

  const decoded = decodeJwtPayload(token)
  if (!decoded || typeof decoded !== 'object') return null

  const payload = decoded as {
    id?: string
    clinicId?: string
    permissions?: unknown
  }

  if (!payload.id || !payload.clinicId) return null

  return {
    userId: payload.id,
    clinicId: payload.clinicId,
    permissions: parseJwtPermissions(payload.permissions) ?? [],
  }
}
