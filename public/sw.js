/* global clients */

self.addEventListener('push', (e) => {
  const data = e.data.json()
  self.registration.showNotification(data.title, {
    body: data.body,
  })
})

self.addEventListener('notificationclick', (e) => {
  e.notification.close()

  e.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.visibilityState === 'visible') {
            return client.focus()
          }
        }
        return clients.openWindow('/')
      }),
  )
})
