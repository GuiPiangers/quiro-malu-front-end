import { CreateUserData } from '@/app/(authentication)/register/page'

export type StateDTO = {
  name: string
  acronym?: string
}

export type LocationDTO = {
  cep?: string | null
  state?: StateDTO | null
  city?: string | null
  neighborhood?: string | null
  address?: string | null
}

export type PatientResponse = {
  id?: string
  name: string
  phone: string
  dateOfBirth?: string | null
  gender?: 'masculino' | 'feminino' | null
  cpf?: string | null
  location?: LocationDTO | null
}
export type PatientsListResponse = [
  {
    id?: string
    name: string
    phone: string
    dateOfBirth?: string | null
  },
]

export class PatientService {
  constructor(
    private fetchData: <T>(
      input: RequestInfo,
      init?: RequestInit | undefined,
    ) => Promise<T>,
  ) {}

  async create(data: CreateUserData) {
    await this.fetchData('http://localhost:8000/patients', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    })
  }

  async update(data: CreateUserData) {
    await this.fetchData<void>('http://localhost:8000/patients', {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    })
  }

  async get(id: string) {
    const res = await this.fetchData<PatientResponse>(`/patients/${id}`, {
      method: 'GET',
    })
    return res
  }

  async list() {
    const res = await this.fetchData<PatientsListResponse>('/patients', {
      method: 'GET',
    })
    return res
  }
}
