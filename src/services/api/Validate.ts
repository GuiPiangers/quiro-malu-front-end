import { responseError } from './api'

export class Validate {
  static isError<T>(data: T | responseError): data is responseError {
    console.log(data)
    if ((data as responseError)?.error) return true
    return false
  }

  static isOk<T>(data: T | responseError): data is T {
    if ((data as responseError)?.error) return false
    return true
  }
}
