import { NextRequest, NextResponse } from 'next/server'

export default async function middleware(request: NextRequest) {
  const refreshToken = request.cookies.get('quiro-refresh-token')?.value
  const signURL = new URL('/login', request.url)
  const response = NextResponse.next()

  if (!refreshToken) {
    return NextResponse.redirect(signURL)
  }
  return response
}

export const config = {
  matcher:
    '/((?!login|logo|_next/static|_next/image|register|favicon.ico|icon.png|icon192x192.png|icon512x512.png).*)',
}
