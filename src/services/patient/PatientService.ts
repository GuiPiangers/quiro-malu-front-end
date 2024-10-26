import { CreatePatientData } from '@/app/(private)/patients/components/PatientDataForm'
import { responseError } from '../api/api'
import { ServiceApi, ServiceApiFetchData } from '../api/ServiceApi'

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
export type PatientsListResponse = {
  patients: Array<{
    id?: string
    name: string
    phone: string
    dateOfBirth?: string | null
  }>
  total: number
  limit: number
}
export type AnamnesisResponse = {
  patientId?: string
  mainProblem?: string
  currentIllness?: string
  history?: string
  familiarHistory?: string
  activities?: string
  smoke?: string | null
  useMedicine?: boolean | null
  medicines?: string
  underwentSurgery?: boolean | null
  surgeries?: string
}
export type DiagnosticResponse = {
  patientId: string
  diagnostic: string
  treatmentPlan: string
}
export type ProgressResponse = {
  id: string
  patientId: string
  service: string
  actualProblem: string
  procedures: string
  date: string
  createAt?: string
  updateAt?: string
}
export type ProgressListResponse = {
  progress: ProgressResponse[]
  total: number
  limit: number
}

export class PatientService extends ServiceApi {
  constructor(fetchData: ServiceApiFetchData) {
    super(fetchData)
  }

  async create(data: CreatePatientData) {
    const res = await this.fetchData<PatientResponse>('/patients', {
      method: 'POST',
      body: JSON.stringify(data),
    })

    return res
  }

  async update(data: PatientResponse) {
    const res = await this.fetchData<PatientResponse>('/patients', {
      method: 'PATCH',
      body: JSON.stringify(data),
    })

    return res
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
    const res = await this.fetchData<void>('/patients/anamnesis', {
      method: 'PUT',
      body: JSON.stringify(data),
    })

    return res
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
    const res = await this.fetchData<void>('/patients/diagnostic', {
      method: 'PUT',
      body: JSON.stringify(data),
    })

    return res
  }

  async setProgress(data: ProgressResponse) {
    const res = await this.fetchData<void>('/patients/progress', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    return res
  }

  async getProgress({ patientId, id }: { patientId: string; id: string }) {
    const res = await this.fetchData<ProgressResponse>(
      `/patients/progress/${patientId}/${id}`,
      {
        method: 'GET',
      },
    )
    return res
  }

  async listProgress({
    patientId,
    page = '1',
  }: {
    patientId: string
    page?: string
  }) {
    const res = await this.fetchData<ProgressListResponse>(
      `/patients/progress/${patientId}?page=${page}`,
      {
        method: 'GET',
      },
    )
    return res
  }

  async list({
    page = '1',
    search,
    orderBy,
  }: {
    page?: string
    search?: { [key: string]: string }
    orderBy?: [{ field: string; orientation: string }]
  }) {
    const searchValue = JSON.stringify(search) || null
    const orderValue = JSON.stringify(orderBy) || null
    const res = await this.fetchData<PatientsListResponse>(
      `/patients?page=${page}&search=${searchValue}&orderBy=${orderValue}`,
      {
        method: 'GET',
      },
    )
    return res
  }

  async delete(id: string) {
    const res = await this.fetchData<void>('/patients', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    })
    return res
  }

  async deleteProgress({ id, patientId }: { id: string; patientId: string }) {
    const res = await this.fetchData<void>('/patients/progress', {
      method: 'DELETE',
      body: JSON.stringify({ id, patientId }),
    })
    return res
  }
}
