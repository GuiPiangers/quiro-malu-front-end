import { responseError } from '../api/api'

export type CreateClinicRequest = {
  name: string
  owner: {
    name: string
    email: string
    phone: string
    password: string
  }
}

export async function createClinic(data: CreateClinicRequest) {
  const result = await fetch(`${process.env.NEXT_PUBLIC_HOST}/clinics`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  })
  return result.json() as Promise<{ id: string; name: string }> | responseError
}
