import { cookie } from '../cookies/cookies'
import { api } from './api'

export async function serverApi<T = unknown>(
  input: RequestInfo,
  init?: RequestInit | undefined,
) {
  return await api<T>(input, init, cookie)
}
