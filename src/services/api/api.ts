import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { setCookie } from '../user/user'

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
  const { noContentType, headers, ...initData } = init || {}
  const headersData: HeadersInit = noContentType
    ? {
        Authorization: `Bearer ${token}`,
        ...headers,
      }
    : {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
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
  const { token } = await request(
    `${process.env.NEXT_PUBLIC_HOST}/refresh-token`,
    {
      method: 'POST',
      body: JSON.stringify({ refreshTokenId: refreshToken }),
    },
  ).then((res) => res.json())

  return token
}

export async function api<T>(
  input: RequestInfo,
  init?: RequestInit & { noContentType?: boolean },
): Promise<T | responseError> {
  'use server'

  const baseURL = process.env.NEXT_PUBLIC_HOST

  const token = cookies().get('quiro-token')?.value
  const refreshToken = cookies().get('quiro-refresh-token')?.value

  if (!refreshToken) return redirect('/login')

  if (!token) {
    const newToken = await revalidateToken({ refreshToken })

    if (!newToken) {
      return redirect('/login')
    }
    setCookie('quiro-token', newToken, { maxAge: 60 * 15 })

    const newData = await request(`${baseURL}${input}`, { ...init }, newToken)

    return await newData.json()
  }

  const data = await request(`${baseURL}${input}`, { ...init }, token)

  return data.json()
}
