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
  ): void {
    const cookieStore = cookies()
    const cookie = cookieStore.set(name, value, options)
    console.log(cookie)
  }
}

const cookie = new Cookie()

export { cookie }
