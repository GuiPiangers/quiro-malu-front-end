import { Scheduling } from './SchedulingService'
import { serverApi } from '../api/serverApi'

const schedulingService = new Scheduling(serverApi)

export { schedulingService }
