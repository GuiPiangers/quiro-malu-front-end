import { responseError } from '../api/api'

export type ServiceResponse = {
  id?: string
  name: string
  duration: number
  value: number
}
export type ServiceListResponse = {
  services: ServiceResponse[]
  total: number
  limit: number
}

export class Service {
  constructor(
    private fetchData: <T>(
      input: RequestInfo,
      init?: RequestInit | undefined,
    ) => Promise<T & responseError>,
  ) {}

  async create(data: ServiceResponse) {
    const res = await this.fetchData<ServiceResponse>('/services', {
      method: 'POST',
      body: JSON.stringify(data),
    })

    return res
  }

  async update(data: ServiceResponse) {
    const res = await this.fetchData<ServiceResponse>('/services', {
      method: 'PATCH',
      body: JSON.stringify(data),
    })

    return res
  }

  async get(id: string) {
    const res = await this.fetchData<ServiceResponse>(`/services/${id}`, {
      method: 'GET',
    })
    return res
  }

  async list({ page = '1' }: { page?: string }) {
    const res = await this.fetchData<ServiceListResponse>(
      `/services?page=${page}`,
      {
        method: 'GET',
      },
    )
    return res
  }

  async delete(id: string) {
    const res = await this.fetchData<void>('/services', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    })
    return res
  }
}
