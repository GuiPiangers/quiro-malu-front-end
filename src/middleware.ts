import { NextRequest, NextResponse } from 'next/server'
import {
  ACCESS_TOKEN_COOKIE_MAX_AGE,
  postRefreshToken,
  REFRESH_TOKEN_COOKIE_MAX_AGE,
  type PostRefreshTokenJson,
} from '@/services/api/refreshTokenRequest'

export default async function middleware(request: NextRequest) {
  const token = request.cookies.get('quiro-token')?.value
  const refreshToken = request.cookies.get('quiro-refresh-token')?.value
  const signURL = new URL('/login', request.url)
  const response = NextResponse.next()

  if (!refreshToken) {
    return NextResponse.redirect(signURL)
  }
  if (!token) {
    const deviceId = request.cookies.get('x-device-id')?.value ?? ''
    const userIp =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      request.headers.get('x-real-ip') ??
      ''
    const userAgent = request.headers.get('user-agent') ?? ''

    const newTokenRes = await postRefreshToken({
      baseUrl: process.env.NEXT_PUBLIC_HOST ?? '',
      refreshTokenId: refreshToken,
      deviceId,
      userIp,
      userAgent,
    })

    if (newTokenRes.status !== 200) {
      return NextResponse.redirect(signURL)
    }
    const body = (await newTokenRes.json()) as PostRefreshTokenJson
    if (!body.token) {
      return NextResponse.redirect(signURL)
    }
    response.cookies.set('quiro-token', body.token, {
      maxAge: ACCESS_TOKEN_COOKIE_MAX_AGE,
    })
    if (body.refreshToken) {
      response.cookies.set('quiro-refresh-token', body.refreshToken, {
        maxAge: REFRESH_TOKEN_COOKIE_MAX_AGE,
      })
    }
  }

  return response
}

export const config = {
  matcher:
    '/((?!login|logo|_next/static|_next/image|register|favicon.ico|icon.png|icon192x192.png|icon512x512.png).*)',
}
