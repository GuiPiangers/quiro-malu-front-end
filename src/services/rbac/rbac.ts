'use server'

import { api } from '@/services/api/api'

export type Role = {
  id: string
  clinicId: string
  name: string
  description: string
  isSystem: boolean
}

export type PermissionCatalogItem = {
  id: string
  key: string
  module: string
  action: 'read' | 'write'
  description: string
}

export type RolePermissionEntry = {
  permissionKey: string
  scope?: unknown | null
}

export type CreateRoleInput = {
  name: string
  description?: string
}

export type UpdateRoleInput = {
  id: string
  name?: string
  description?: string
}

export async function listRoles() {
  return api<Role[]>('/roles', { method: 'GET' })
}

export async function createRole(data: CreateRoleInput) {
  return api<Role>('/roles', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateRole({ id, ...data }: UpdateRoleInput) {
  return api<void>(`/roles/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export async function deleteRole({ id }: { id: string }) {
  return api<void>(`/roles/${id}`, {
    method: 'DELETE',
  })
}

export async function listPermissionCatalog() {
  return api<PermissionCatalogItem[]>('/permissions', { method: 'GET' })
}

export async function listRolePermissions(roleId: string) {
  return api<RolePermissionEntry[]>(`/roles/${roleId}/permissions`, {
    method: 'GET',
  })
}

export async function replaceRolePermissions(
  roleId: string,
  permissions: RolePermissionEntry[],
) {
  return api<void>(`/roles/${roleId}/permissions`, {
    method: 'PUT',
    body: JSON.stringify(permissions),
  })
}
