import { getCookie } from '../cookies/cookies'
import { api } from './api'

export async function serverApi<T = unknown>(
  input: RequestInfo,
  init?: RequestInit | undefined,
): Promise<T> {
  return await api(input, init, getCookie)
}
