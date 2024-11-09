import { NextRequest, NextResponse } from 'next/server'

export default async function middleware(request: NextRequest) {
  const token = request.cookies.get('quiro-token')?.value
  const refreshToken = request.cookies.get('quiro-refresh-token')?.value
  const signURL = new URL('/login', request.url)

  if (!token && !refreshToken) {
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
  }
}

export const config = {
  matcher: ['/'],
}
