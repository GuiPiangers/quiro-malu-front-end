import { ServiceApi, ServiceApiFetchData } from '../api/ServiceApi'
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

export class Scheduling extends ServiceApi {
  constructor(fetchData: ServiceApiFetchData) {
    super(fetchData)
  }

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

  async get({ id }: { id: string }) {
    const res = await this.fetchData<SchedulingResponse>(`/schedules/${id}`, {
      method: 'GET',
    })
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

  async getQtdSchedulesByDay({ month, year }: { month: number; year: number }) {
    const res = await this.fetchData<{ date: string; qtd: number }[]>(
      `/Schedules/qtd?month=${month}&year=${year}`,
      {
        method: 'GET',
      },
    )
    return res
  }

  async delete({ id }: { id: string }) {
    const res = await this.fetchData<void>('/schedules', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    })
    return res
  }
}
