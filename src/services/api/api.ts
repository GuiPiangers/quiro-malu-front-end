import { ICookies } from '../cookies/ICookies'
import { clientCookie } from '../cookies/clientCookies'

export async function api<T>(
  input: RequestInfo,
  init?: RequestInit | undefined,
  cookieService?: ICookies,
): Promise<T> {
  const baseURL = 'http://localhost:8000'
  const cookieMethod = cookieService || clientCookie

  const token = cookieMethod.get('quiro-token')
  const refreshToken = cookieMethod.get('quiro-refresh-token')

  const data = await fetch(`${baseURL}${input}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    ...init,
  })

  if (data.status === 401 && refreshToken) {
    const { token: newToken } = await fetch(`${baseURL}/refresh-token`, {
      method: 'POST',
      body: JSON.stringify({ refreshTokenId: refreshToken }),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => res.json())

    cookieMethod.set('quiro-token', newToken, { maxAge: 60 * 10 })
    const newData = await fetch(`${baseURL}${input}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${newToken}`,
      },
      ...init,
    })
    console.log(newData.json())
    return await newData.json()
  }
  return data.json()
}
