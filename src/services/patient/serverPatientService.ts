import { PatientService } from './PatientService'
import { serverApi } from '../api/serverApi'

const patientService = new PatientService(serverApi)

export { patientService }
