import { parseCookies, setCookie, destroyCookie } from 'nookies'
import { ICookies } from './ICookies'
import { CookieSerializeOptions } from 'cookie'

class ClientCookie implements ICookies {
  delete(name: string): void {
    destroyCookie(undefined, name)
  }

  get(name: string): string | undefined {
    const cookie = parseCookies()[name]
    return cookie
  }

  set(
    name: string,
    value: string,
    options?: CookieSerializeOptions | undefined,
  ): void {
    setCookie(undefined, name, value, options)
  }
}

const clientCookie = new ClientCookie()
export { clientCookie }
