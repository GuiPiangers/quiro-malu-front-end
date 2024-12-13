'use server'

import { CreateUserData } from '@/app/(authentication)/register/page'
import { SignInData } from '@/contexts/AuthContext'
import { api } from '@/services/api/api'

export type UserResponse = {
  token: string
  refreshToken: string
  user: {
    name: string
    email: string
  }
}

export async function registerUser(data: CreateUserData) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/register`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  })
  return await res.json()
}

export async function loginUser(data: SignInData) {
  const res = await api<UserResponse>('/login', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return res
}

export async function logoutUser(refreshTokenId: string): Promise<void> {
  await api<UserResponse>('/logout', {
    method: 'POST',
    body: JSON.stringify({ refreshTokenId }),
  })
}

export async function getUser() {
  const res = await api<UserResponse['user']>('/profile', {
    method: 'GET',
    cache: 'no-store',
  })
  return res
}
