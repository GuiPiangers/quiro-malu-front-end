import { responseError } from '@/services/api/api'

export type appointments = {
  date: string
  qtd: number
}

export type CalendarProps = {
  getAppointments?({
    month,
    year,
  }: {
    month: number
    year: number
  }): Promise<appointments[] | responseError>
}
