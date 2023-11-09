import { CreatePatientData } from '@/app/(private)/(routes)/patients/components/PatientDataForm'

export type LocationDTO = {
  cep?: string | null
  state?: string | null
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

  async create(data: CreatePatientData) {
    await this.fetchData('/patients', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async update(data: CreatePatientData) {
    await this.fetchData<void>('/patients', {
      method: 'PATCH',
      body: JSON.stringify(data),
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
