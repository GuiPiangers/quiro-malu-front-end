import { ICookies } from '../cookies/ICookies'
import { clientCookie } from '../cookies/clientCookies'

const request = async (
  input: RequestInfo,
  init?: RequestInit | undefined,
  token?: string,
) => {
  const data = await fetch(input, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    ...init,
  })
  return data
}

export type responseError = {
  message: string
  statusCode: number
  type: string
}

export async function api<T>(
  input: RequestInfo,
  init?: RequestInit | undefined,
  cookieService?: ICookies,
): Promise<T & responseError> {
  const baseURL = 'http://localhost:8000'
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
