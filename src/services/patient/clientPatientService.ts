import { PatientService } from './PatientService'
import { api } from '../api/api'

const clientPatientService = new PatientService(api)

export { clientPatientService }
