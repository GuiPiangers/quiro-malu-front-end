import { Validate } from '../api/Validate'
import type { responseError } from '../api/api'
import type { ListedMessageSendStrategyDTO } from './sendListTypes'

function listedStrategyParamsLookValid(
  row: ListedMessageSendStrategyDTO,
): boolean {
  switch (row.kind) {
    case 'send_most_recent_patients':
    case 'send_most_frequency_patients':
      return (
        typeof row.params.amount === 'number' &&
        Number.isFinite(row.params.amount)
      )
    case 'send_selected_list':
    case 'exclude_patients_list':
      return (
        Array.isArray(row.params.patientIdList) &&
        row.params.patientIdList.every((x) => typeof x === 'string')
      )
    default:
      return false
  }
}

export function isListedMessageSendStrategyDTO(
  value: ListedMessageSendStrategyDTO | responseError,
): value is ListedMessageSendStrategyDTO {
  if (Validate.isError(value)) return false
  if (
    typeof value !== 'object' ||
    value === null ||
    typeof (value as ListedMessageSendStrategyDTO).id !== 'string' ||
    typeof (value as ListedMessageSendStrategyDTO).name !== 'string' ||
    typeof (value as ListedMessageSendStrategyDTO).kind !== 'string'
  ) {
    return false
  }
  return listedStrategyParamsLookValid(value as ListedMessageSendStrategyDTO)
}

export function linkedMessageSendStrategyFromSettled(
  settled: PromiseSettledResult<ListedMessageSendStrategyDTO | responseError>,
): ListedMessageSendStrategyDTO | null {
  if (settled.status === 'rejected') return null
  const v = settled.value
  if (Validate.isError(v)) return null
  return isListedMessageSendStrategyDTO(v) ? v : null
}
