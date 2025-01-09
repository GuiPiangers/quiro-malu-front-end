import { NextRequest, NextResponse } from 'next/server'

export default async function middleware(request: NextRequest) {
  const token = request.cookies.get('quiro-token')?.value
  const refreshToken = request.cookies.get('quiro-refresh-token')?.value
  const signURL = new URL('/login', request.url)
  const response = NextResponse.next()

  if (!refreshToken) {
    return NextResponse.redirect(signURL)
  }
  if (!token) {
    const newToken = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/refresh-token`,
      {
        method: 'POST',
        body: JSON.stringify({ refreshTokenId: refreshToken }),
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    if (newToken.status !== 200) {
      return NextResponse.redirect(signURL)
    }
    response.cookies.set('quiro-token', await newToken.json(), {
      maxAge: 60 * 15, // 15 min
    })
  }

  return response
}

export const config = {
  matcher: '/((?!login|logo|_next/static|_next/image|register|favicon.ico).*)',
}
