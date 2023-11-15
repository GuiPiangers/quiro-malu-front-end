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
  createAt?: string
}
export type PatientsListResponse = [
  {
    id?: string
    name: string
    phone: string
    dateOfBirth?: string | null
  },
]
export type AnamnesisResponse = {
  patientId: string
  mainProblem: string
  currentIllness: string
  history: string
  familiarHistory: string
  activities: string
  smoke: string
  useMedicine: string
  medicines: string
  underwentSurgery: string
  surgeries: string
}
export type DiagnosticResponse = {
  diagnostic: string
  treatmentPlan: string
}

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

  async update(data: PatientResponse) {
    console.log(data)
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

  async getAnamnesis(id: string) {
    const res = await this.fetchData<AnamnesisResponse>(
      `/patients/anamnesis/${id}`,
      {
        method: 'GET',
      },
    )
    return res
  }

  async setAnamnesis(data: AnamnesisResponse) {
    console.log(data)
    await this.fetchData<void>('/patients/anamnesis', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async getDiagnostic(id: string) {
    const res = await this.fetchData<DiagnosticResponse>(
      `/patients/diagnostic/${id}`,
      {
        method: 'GET',
      },
    )
    return res
  }

  async setDiagnostic(data: DiagnosticResponse) {
    console.log(data)
    await this.fetchData<void>('/patients/diagnostic', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async list() {
    const res = await this.fetchData<PatientsListResponse>('/patients', {
      method: 'GET',
    })
    return res
  }

  async delete(id: string) {
    const res = await this.fetchData<PatientsListResponse>('/patients', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    })
    return res
  }
}
