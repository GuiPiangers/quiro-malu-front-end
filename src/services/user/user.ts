'use server'

import { CreateUserData } from '@/app/(authentication)/register/page'
import { api, responseError } from '@/services/api/api'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Validate } from '../api/Validate'

export type UserResponse = {
  token: string
  refreshToken: string
  user: {
    name: string
    email: string
  }
}

export async function setCookie(
  name: string,
  value: string,
  config: { maxAge: number },
) {
  cookies().set(name, value, config)
}

export async function registerUser(data: CreateUserData) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/register`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  })
  return await res.json()
}

export async function loginUser(data: { email: string; password: string }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  const auth: UserResponse | responseError = await res.json()

  if (Validate.isOk(auth)) {
    cookies().set('quiro-token', auth.token, {
      maxAge: 60 * 15, // 15 min
    })
    cookies().set('quiro-refresh-token', auth.refreshToken, {
      maxAge: 60 * 60 * 24 * 15, // 15 dias
    })
    redirect('/')
  }
  return auth
}

export async function logoutUser(): Promise<void> {
  const refreshTokenId = cookies().get('quiro-refresh-token')
  await api<UserResponse>('/logout', {
    method: 'POST',
    body: JSON.stringify({ refreshTokenId }),
  })

  cookies().delete('quiro-token')
  cookies().delete('quiro-refresh-token')
  redirect('/login')
}

export async function getUser() {
  const res = await api<UserResponse['user']>('/profile', {
    method: 'GET',
    cache: 'no-store',
  })
  return res
}
