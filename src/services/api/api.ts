import { cookies, headers as headerFn } from 'next/headers'
import { redirect, RedirectType } from 'next/navigation'
import {
  ACCESS_TOKEN_COOKIE_MAX_AGE,
  REFRESH_TOKEN_COOKIE_MAX_AGE,
  postRefreshToken,
  type PostRefreshTokenJson,
} from './refreshTokenRequest'

export type responseError = {
  message: string
  statusCode: number
  type: string
  error: boolean
}

const request = async (
  input: RequestInfo | URL,
  init?: RequestInit & { noContentType?: boolean },
  token?: string,
) => {
  const cookieStore = cookies()
  const headerStore = headerFn()

  const deviceId = cookieStore.get('x-device-id')?.value ?? ''
  const userIp =
    headerStore.get('x-forwarded-for')?.split(',')[0] ??
    headerStore.get('x-real-ip') ??
    ''
  const userAgent = headerStore.get('user-agent') ?? ''

  const { noContentType, headers, ...initData } = init || {}
  const headersData: HeadersInit = noContentType
    ? {
        Authorization: `Bearer ${token}`,
        ...headers,
      }
    : {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'X-Device-ID': deviceId,
        'X-User-IP': userIp,
        'X-User-Agent': userAgent,
        ...headers,
      }

  const data = await fetch(input, {
    headers: headersData,
    ...initData,
  })
  return data
}

export const revalidateToken = async ({
  refreshToken,
}: {
  refreshToken: string
}) => {
  const cookieStore = cookies()
  const headerStore = headerFn()
  const deviceId = cookieStore.get('x-device-id')?.value ?? ''
  const userIp =
    headerStore.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    headerStore.get('x-real-ip') ??
    ''
  const userAgent = headerStore.get('user-agent') ?? ''

  const response = await postRefreshToken({
    baseUrl: process.env.NEXT_PUBLIC_HOST ?? '',
    refreshTokenId: refreshToken,
    deviceId,
    userIp,
    userAgent,
  })

  const data = (await response.json()) as PostRefreshTokenJson
  if (!data.token) {
    return undefined
  }

  cookieStore.set('quiro-token', data.token, {
    maxAge: ACCESS_TOKEN_COOKIE_MAX_AGE,
  })
  if (data.refreshToken) {
    cookieStore.set('quiro-refresh-token', data.refreshToken, {
      maxAge: REFRESH_TOKEN_COOKIE_MAX_AGE,
    })
  }

  return data.token
}

export async function api<T>(
  input: RequestInfo,
  init?: RequestInit & { noContentType?: boolean },
): Promise<T | responseError> {
  const baseURL = process.env.NEXT_PUBLIC_HOST

  const token = cookies().get('quiro-token')?.value
  const refreshToken = cookies().get('quiro-refresh-token')?.value

  const data = await request(`${baseURL}${input}`, { ...init }, token)

  if (data.status === 204) return undefined as T

  if (data.status === 418) redirect('/login', RedirectType.replace)

  if (data.status === 401 && refreshToken) {
    const newToken = await revalidateToken({ refreshToken })

    if (!newToken) redirect('/login', RedirectType.replace)

    const newData = await request(`${baseURL}${input}`, { ...init }, newToken)

    return await newData.json()
  }

  return data.json()
}
