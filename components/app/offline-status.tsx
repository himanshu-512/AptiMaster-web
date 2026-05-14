'use client'

import { useEffect, useState } from 'react'
import { WifiOff } from 'lucide-react'

export function OfflineStatus() {
  const [offline, setOffline] = useState(false)

  useEffect(() => {
    const updateStatus = () => setOffline(!navigator.onLine)
    updateStatus()
    window.addEventListener('online', updateStatus)
    window.addEventListener('offline', updateStatus)
    return () => {
      window.removeEventListener('online', updateStatus)
      window.removeEventListener('offline', updateStatus)
    }
  }, [])

  if (!offline) return null

  return (
    <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-warning/30 bg-warning/15 px-4 py-2 text-sm font-medium text-warning shadow-lg backdrop-blur">
      <WifiOff className="h-4 w-4" />
      You are offline. Some data may be unavailable.
    </div>
  )
}
