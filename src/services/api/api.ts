import { cookies } from 'next/headers'

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
  const baseURL = process.env.NEXT_PUBLIC_HOST

  const token = cookies().get('quiro-token')?.value
  const refreshToken = cookies().get('quiro-refresh-token')?.value

  const data = await request(`${baseURL}${input}`, { ...init }, token)

  if (data.status === 401 && refreshToken) {
    const newToken = await revalidateToken({ refreshToken })

    if (!newToken) throw new Error('Falha de autenticação')
    const newData = await request(`${baseURL}${input}`, { ...init }, newToken)

    if (newData.status === 401) {
      const newToken = await revalidateToken({ refreshToken })

      if (!newToken) {
        return redirect('/login')
      }
      setCookie('quiro-token', newToken, { maxAge: 60 * 15 })

      return (await request(`${baseURL}${input}`, { ...init }, newToken)).json()
    }

    return await newData.json()
  }
  return data.json()
}
