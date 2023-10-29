import { parseCookies } from 'nookies'

export function getClientCookie(name: string) {
  const cookie = parseCookies()[name]
  return cookie
}
