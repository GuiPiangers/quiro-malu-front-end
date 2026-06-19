'use server'

import { api, responseError } from '@/services/api/api'
import {
  ACCESS_TOKEN_COOKIE_MAX_AGE,
  REFRESH_TOKEN_COOKIE_MAX_AGE,
} from '@/services/api/refreshTokenRequest'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Validate } from '@/services/api/Validate'

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

export async function loginUser(data: { email: string; password: string }) {
  const cookieStore = cookies()
  let deviceId = cookieStore.get('x-device-id')?.value

  if (!deviceId) {
    deviceId = crypto.randomUUID()
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Device-ID': deviceId,
    },
    body: JSON.stringify(data),
  })

  const auth: UserResponse | responseError = await res.json()

  if (Validate.isOk(auth)) {
    cookies().set('quiro-token', auth.token, {
      maxAge: ACCESS_TOKEN_COOKIE_MAX_AGE,
    })
    cookies().set('quiro-refresh-token', auth.refreshToken, {
      maxAge: REFRESH_TOKEN_COOKIE_MAX_AGE,
    })
    cookies().set('x-device-id', deviceId, {
      maxAge: 60 * 60 * 24 * 365, // 1 ano
      path: '/',
      sameSite: 'strict',
    })
    redirect('/')
  }

  return auth
}

export async function resetPassword(data: { token: string; password: string }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (res.ok) return null

  const error: responseError = await res.json()
  return error
}

export async function logoutUser(): Promise<void> {
  const refreshTokenId = cookies().get('quiro-refresh-token')?.value
  await api<UserResponse>('/logout', {
    method: 'POST',
    body: JSON.stringify({ refreshTokenId }),
  })

  cookies().delete('quiro-token')
  cookies().delete('quiro-refresh-token')
  redirect('/login')
}

export async function sendResetPasswordToken(data: { email: string }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/send-reset-password-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (res.ok) return null

  const error: responseError = await res.json()
  return error
}
