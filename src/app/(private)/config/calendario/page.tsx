import CalendarSettingsForm from '@/components/form/calendar/CalendarSettingsForm'
import { Validate } from '@/services/api/Validate'
import { getCalendarConfiguration } from '@/services/config/calendar/calendarConfiguration'

export default async function CalendarPage() {
  const calendarConfiguration = await getCalendarConfiguration().then((res) =>
    Validate.isError(res) ? undefined : res,
  )

  return <CalendarSettingsForm formData={calendarConfiguration} />
}
