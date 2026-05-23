import { responseError } from '@/services/api/api'

export type appointments = {
  date: string
  qtd: number
}

export type CalendarProps = {
  /** Quando definido, busca contagens via TanStack Query (invalidável após mutações). */
  schedulesQtdUserId?: string
  getAppointments?({
    month,
    year,
  }: {
    month: number
    year: number
  }): Promise<appointments[] | responseError>
}
