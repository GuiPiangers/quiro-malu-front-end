import { cookies } from 'next/headers'

export function getCookie(name: string) {
  const cookieStore = cookies()
  const cookie = cookieStore.get(name)
  return cookie?.value
}
