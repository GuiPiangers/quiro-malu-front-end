import { CookieSerializeOptions } from 'cookie'
import { cookies } from 'next/headers'
import { ICookies } from './ICookies'

class Cookie implements ICookies {
  get(name: string): string | undefined {
    const cookieStore = cookies()
    const cookie = cookieStore.get(name)
    if (!cookie) return
    return cookie.value
  }

  set(
    name: string,
    value: string,
    options?: CookieSerializeOptions | undefined,
  ) {
    return {}
  }

  delete(name: string) {
    const cookieStore = cookies()
    cookieStore.delete(name)
  }
}

const cookie = new Cookie()

export { cookie }
