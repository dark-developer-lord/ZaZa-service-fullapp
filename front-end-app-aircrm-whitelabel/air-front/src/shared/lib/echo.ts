/**
 * Laravel Echo singleton configured for beyondcode/laravel-websockets
 * (self-hosted Pusher-compatible WebSocket server).
 *
 * Usage:
 *   import { getEcho } from '@shared/lib/echo'
 *
 *   getEcho().private(`messenger.store.${storeId}`)
 *     .listen('.NewMessengerMessage', (data) => { ... })
 */

import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import { getToken } from '../auth'

// Make Pusher available globally (required by laravel-echo internally)
;(window as any).Pusher = Pusher

let echoInstance: Echo | null = null

/**
 * Returns the shared Echo instance, creating it on first call.
 * Reconnects automatically if the token changes (page reload handles this).
 */
export function getEcho(): Echo {
  if (echoInstance) return echoInstance

  const token = getToken()

  echoInstance = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER ?? 'mt1',
    wsHost: import.meta.env.VITE_PUSHER_HOST ?? '127.0.0.1',
    wsPort: Number(import.meta.env.VITE_PUSHER_PORT ?? 6001),
    wssPort: Number(import.meta.env.VITE_PUSHER_PORT ?? 6001),
    forceTLS: (import.meta.env.VITE_PUSHER_SCHEME ?? 'http') === 'https',
    encrypted: (import.meta.env.VITE_PUSHER_SCHEME ?? 'http') === 'https',
    enabledTransports: ['ws', 'wss'],
    disableStats: true,
    // Pass the vendor auth token for private channel authorization
    authEndpoint: '/broadcasting/auth',
    auth: {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    },
  })

  return echoInstance
}

/**
 * Destroy the current Echo connection (e.g. on logout).
 */
export function destroyEcho(): void {
  if (echoInstance) {
    echoInstance.disconnect()
    echoInstance = null
  }
}
