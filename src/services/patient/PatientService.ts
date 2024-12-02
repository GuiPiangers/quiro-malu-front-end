import { CreatePatientData } from '@/app/(private)/patients/components/PatientDataForm'
import { ServiceApi, ServiceApiFetchData } from '../api/ServiceApi'

export type LocationDTO = {
  cep?: string
  state?: string
  city?: string
  neighborhood?: string
  address?: string
}

export type PatientResponse = {
  id?: string
  name: string
  phone: string
  dateOfBirth?: string
  gender?: 'masculino' | 'feminino'
  cpf?: string
  location?: LocationDTO
  createAt?: string
  education?: string
  profession?: string
  maritalStatus?: string
}

export type uploadPatientsResponse = {
  duplicateCounter: number
  erroCounter: number
  errors: { error: string; patient: PatientResponse }[]
  successCounter: number
}

export type PatientsListResponse = {
  patients: Array<{
    id?: string
    name: string
    phone: string
    dateOfBirth?: string
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
  diagnostic?: string
  treatmentPlan?: string
}
export type ProgressResponse = {
  id: string
  patientId: string
  service: string
  actualProblem: string
  procedures: string
  date: string
  schedulingId?: string
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

  async upload(data: File) {
    const formData = new FormData()
    formData.append('file', data)

    const res = await this.fetchData<uploadPatientsResponse>(
      '/uploadPatients',
      {
        method: 'POST',
        body: formData,
        noContentType: true,
      },
    )

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

  async getProgressByScheduling({
    patientId,
    schedulingId,
  }: {
    patientId: string
    schedulingId: string
  }) {
    const res = await this.fetchData<ProgressResponse>(
      `/patients/progress/scheduling/${patientId}/${schedulingId}`,
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
    limit = 20,
  }: {
    page?: string
    search?: { [key: string]: string }
    orderBy?: [{ field: string; orientation: string }]
    limit?: number | 'all'
  }) {
    const searchValue = JSON.stringify(search) || null
    const orderValue = JSON.stringify(orderBy) || null
    const limitValue = limit === 'all' ? limit : JSON.stringify(limit)

    const res = await this.fetchData<PatientsListResponse>(
      `/patients?page=${page}&search=${searchValue}&orderBy=${orderValue}&limit=${limitValue}`,
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
