import CalendarSettingsForm from '@/components/form/calendar/CalendarSettingsForm'
import { getCalendarConfiguration } from '@/services/config/calendar/calendarConfiguration'

export default async function CalendarPage() {
  const calendarConfiguration = await getCalendarConfiguration()

  return <CalendarSettingsForm formData={calendarConfiguration} />
}
