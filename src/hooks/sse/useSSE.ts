import { useEffect, useState } from 'react'

export function useSSE<T>(url: string) {
  const [events, setEvents] = useState<T>()

  useEffect(() => {
    let eventSource: EventSource | null = null

    eventSource = new EventSource(url)

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      console.log('📩 Mensagem recebida:', data)
      setEvents(data)
    }

    eventSource.onerror = () => {
      eventSource?.close()
      sessionStorage.removeItem('sse_active')
    }

    return () => {
      eventSource?.close()
    }
  }, [url])

  return events
}
