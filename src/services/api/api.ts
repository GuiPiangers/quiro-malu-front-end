import { getClientCookie } from '../cookies/clientCookies'

export async function api<T>(
  input: RequestInfo,
  init?: RequestInit | undefined,
  cookieMethod?: (name: string) => string | undefined,
): Promise<T> {
  const baseURL = 'http://localhost:8000'
  const token = cookieMethod
    ? cookieMethod('quiro-token')
    : getClientCookie('quiro-token')

  const data = await fetch(`${baseURL}${input}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    ...init,
  })

  console.log(data.status)
  return data.json()
}
