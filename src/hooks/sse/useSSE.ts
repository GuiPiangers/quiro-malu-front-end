import { ProcessSEE } from '@/utils/processSSE'
import { useEffect, useState } from 'react'

export function useSSE<T>(url: string) {
  const [events, setEvents] = useState<T>()
  const eventSource = new ProcessSEE()

  useEffect(() => {
    const tokenEntry = document.cookie
      .split(';')
      .map((cookieString) => {
        return cookieString.trim().split('=')
      })
      .find(([key]) => key === 'quiro-token')

    const token = tokenEntry ? tokenEntry[1] : undefined

    const connect = async () => {
      await eventSource.connect(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      eventSource.onMessage<T>((data) => {
        setEvents(data)
      })
    }

    connect()

    return () => {
      eventSource?.close()
    }
  }, [url])

  return events
}
