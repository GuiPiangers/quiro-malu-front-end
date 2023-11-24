import { Scheduling } from './SchedulingService'
import { api } from '../api/api'

const clientSchedulingService = new Scheduling(api)

export { clientSchedulingService }
