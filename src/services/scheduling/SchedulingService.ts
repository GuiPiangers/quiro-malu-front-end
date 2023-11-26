import { responseError } from '../api/api'

export type SchedulingResponse = {
  id?: string
  patientId: string
  service: string
  duration: number
  status: string
  date: string
}
export type SchedulingListResponse = {
  schedules: (SchedulingResponse & { patient: string; phone: string })[]
  total: number
  limit: number
}

export class Scheduling {
  constructor(
    private fetchData: <T>(
      input: RequestInfo,
      init?: RequestInit | undefined,
    ) => Promise<T & responseError>,
  ) {}

  async create(data: SchedulingResponse) {
    const res = await this.fetchData<SchedulingResponse>('/schedules', {
      method: 'POST',
      body: JSON.stringify(data),
    })

    return res
  }

  async update(data: SchedulingResponse) {
    const res = await this.fetchData<SchedulingResponse>('/schedules', {
      method: 'PATCH',
      body: JSON.stringify(data),
    })

    return res
  }

  async get({ id, patientId }: { patientId: string; id: string }) {
    const res = await this.fetchData<SchedulingResponse>(
      `/schedules/${patientId}/${id}`,
      {
        method: 'GET',
      },
    )
    return res
  }

  async list({ date, page = '1' }: { date: string; page?: string }) {
    const res = await this.fetchData<SchedulingListResponse>(
      `/Schedules?page=${page}&date=${date}`,
      {
        method: 'GET',
      },
    )
    return res
  }

  async delete({ id, patientId }: { patientId: string; id: string }) {
    const res = await this.fetchData<void>('/schedules', {
      method: 'DELETE',
      body: JSON.stringify({ id, patientId }),
    })
    return res
  }
}
