import { Validate } from '../api/Validate'
import type { responseError } from '../api/api'
import type { ListedMessageSendStrategyDTO } from './sendListTypes'

export function isListedMessageSendStrategyDTO(
  value: ListedMessageSendStrategyDTO | responseError,
): value is ListedMessageSendStrategyDTO {
  if (Validate.isError(value)) return false
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as ListedMessageSendStrategyDTO).id === 'string' &&
    typeof (value as ListedMessageSendStrategyDTO).name === 'string' &&
    typeof (value as ListedMessageSendStrategyDTO).kind === 'string'
  )
}

export function linkedMessageSendStrategyFromSettled(
  settled: PromiseSettledResult<ListedMessageSendStrategyDTO | responseError>,
): ListedMessageSendStrategyDTO | null {
  if (settled.status === 'rejected') return null
  const v = settled.value
  if (Validate.isError(v)) return null
  return isListedMessageSendStrategyDTO(v) ? v : null
}
