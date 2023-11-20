import { Service } from './Service'
import { serverApi } from '../api/serverApi'

const service = new Service(serverApi)

export { service }
