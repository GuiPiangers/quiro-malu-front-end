import {
  BlockScheduleResponse,
  SchedulingResponse,
} from '@/services/scheduling/scheduling'

export function isSchedulingEvent<T>(
  event: (SchedulingResponse & T) | BlockScheduleResponse,
): event is SchedulingResponse & T {
  return Object.hasOwn(event, 'duration') && Object.hasOwn(event, 'patientId')
}
