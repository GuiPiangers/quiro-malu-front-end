import { responseError } from './api'

export type ServiceApiFetchData = <T>(
  input: RequestInfo,
  init?: RequestInit,
) => Promise<T | responseError>

export class ServiceApi {
  constructor(readonly fetchData: ServiceApiFetchData) {}
}
