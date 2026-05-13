/**
 * POST /refresh-token — sem `next/headers`; pode rodar no Edge (middleware) e no servidor.
 */

/** Alinhado ao login (`loginUser`): access curto, refresh longo. */
export const ACCESS_TOKEN_COOKIE_MAX_AGE = 60 * 15
export const REFRESH_TOKEN_COOKIE_MAX_AGE = 60 * 60 * 24 * 15

export type PostRefreshTokenJson = {
  token?: string
  refreshToken?: string
}

export async function postRefreshToken(params: {
  baseUrl: string
  refreshTokenId: string
  deviceId: string
  userIp?: string
  userAgent?: string
}): Promise<Response> {
  const {
    baseUrl,
    refreshTokenId,
    deviceId,
    userIp = '',
    userAgent = '',
  } = params
  const origin = baseUrl.replace(/\/+$/, '')

  return fetch(`${origin}/refresh-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Device-ID': deviceId,
      ...(userIp ? { 'X-User-IP': userIp } : {}),
      ...(userAgent ? { 'X-User-Agent': userAgent } : {}),
    },
    body: JSON.stringify({ refreshTokenId }),
  })
}
