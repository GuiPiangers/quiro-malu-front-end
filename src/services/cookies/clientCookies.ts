import { parseCookies, setCookie } from 'nookies'
import { ICookies } from './ICookies'
import { CookieSerializeOptions } from 'cookie'

class ClientCookie implements ICookies {
  get(name: string): string | undefined {
    const cookie = parseCookies()[name]
    return cookie
  }

  set(
    name: string,
    value: string,
    options?: CookieSerializeOptions | undefined,
  ): void {
    const cookie = setCookie(undefined, name, value, options)
    console.log(cookie)
  }
}

const clientCookie = new ClientCookie()
export { clientCookie }
