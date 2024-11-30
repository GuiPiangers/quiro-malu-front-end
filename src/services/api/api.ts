import { ICookies } from '../cookies/ICookies'
import { clientCookie } from '../cookies/clientCookies'

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

export type responseError = {
  message: string
  statusCode: number
  type: string
  error: boolean
}

export async function api<T>(
  input: RequestInfo,
  init?: RequestInit & { noContentType?: boolean },
  cookieService?: ICookies,
): Promise<T | responseError> {
  const baseURL = process.env.NEXT_PUBLIC_HOST
  const cookieMethod = cookieService || clientCookie

  const token = cookieMethod.get('quiro-token')
  const refreshToken = cookieMethod.get('quiro-refresh-token')

  const data = await request(`${baseURL}${input}`, { ...init }, token)

  if (data.status === 401 && refreshToken) {
    const { token: newToken } = await request(`${baseURL}/refresh-token`, {
      method: 'POST',
      body: JSON.stringify({ refreshTokenId: refreshToken }),
    }).then((res) => res.json())

    if (!newToken) throw new Error('Falha de autenticação')
    const newData = await request(`${baseURL}${input}`, { ...init }, newToken)
    clientCookie.set('quiro-token', newToken, { maxAge: 60 * 10 })

    return await newData.json()
  }
  return data.json()
}
