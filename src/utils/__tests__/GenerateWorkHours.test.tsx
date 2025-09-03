import { GenerateWorkHours } from '../GenerateWorkHours'

jest.mock('../Date', () => ({
  __esModule: true,
  default: {
    getTime: jest.fn((date: Date | string) => {
      const dateValue = typeof date === 'string' ? new Date(date) : date
      const hours = dateValue.getHours().toString().padStart(2, '0')
      const minutes = dateValue.getMinutes().toString().padStart(2, '0')
      return `${hours}:${minutes}`
    }),
  },
}))

describe('GenerateWorkHours', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('constructor', () => {
    it('deve gerar workHours baseado nos workSchedules e na duração dos agendamentos', () => {
      const workSchedules = [{ start: '08:00', end: '10:00' }]
      const schedulingDuration = 30

      const instance = new GenerateWorkHours({
        workSchedules,
        workTimeIncrementInMinutes: schedulingDuration,
      })

      expect(instance.workHours).toEqual([
        '08:00',
        '08:30',
        '09:00',
        '09:30',
        '10:00',
      ])
    })
  })

  describe('generate', () => {
    it('deve retornar os horários disponíveis e incluir os agendamentos existentes', () => {
      const workSchedules = [{ start: '08:00', end: '10:00' }]
      const schedulingDuration = 30

      const instance = new GenerateWorkHours({
        workSchedules,
        workTimeIncrementInMinutes: schedulingDuration,
      })

      const existingSchedules = [
        { date: '2023-12-01T08:30:00', duration: 1800 },
        { date: '2023-12-01T09:30:00', duration: 1800 },
      ]

      const result = instance.generate(existingSchedules)

      expect(result).toEqual([
        ['08:00', null],
        ['08:30', { date: '2023-12-01T08:30:00', duration: 1800 }],
        ['09:00', null],
        ['09:30', { date: '2023-12-01T09:30:00', duration: 1800 }],
        ['10:00', null],
      ])
      expect(result.length).toBe(5)
    })

    it('deve retornar os horários disponíveis, excluindo os horários intervalos de agendamentos existentes', () => {
      const workSchedules = [{ start: '08:00', end: '10:00' }]
      const schedulingDuration = 30

      const instance = new GenerateWorkHours({
        workSchedules,
        workTimeIncrementInMinutes: schedulingDuration,
      })

      const existingSchedules = [
        { date: '2023-12-01T08:30:00', duration: 3600 },
        { date: '2023-12-01T09:30:00', duration: 3600 },
      ]

      const result = instance.generate(existingSchedules)

      expect(result).toEqual([
        ['08:00', null],
        ['08:30', { date: '2023-12-01T08:30:00', duration: 3600 }],
        ['09:30', { date: '2023-12-01T09:30:00', duration: 3600 }],
      ])
      expect(result.length).toBe(3)
    })

    it('deve retornar todos os horários se não houver agendamentos', () => {
      const workSchedules = [{ start: '08:00', end: '10:00' }]
      const schedulingDuration = 30

      const instance = new GenerateWorkHours({
        workSchedules,
        workTimeIncrementInMinutes: schedulingDuration,
      })

      const existingSchedules: any[] = []

      const result = instance.generate(existingSchedules)

      expect(result).toEqual([
        ['08:00', null],
        ['08:30', null],
        ['09:00', null],
        ['09:30', null],
        ['10:00', null],
      ])
    })
  })
})
