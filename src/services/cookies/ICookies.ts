import { CookieSerializeOptions } from 'cookie'

export interface ICookies {
  get(name: string): string | undefined
  set(
    name: string,
    value: string,
    options?: CookieSerializeOptions | undefined,
  ): void
  delete(name: string): void
}
