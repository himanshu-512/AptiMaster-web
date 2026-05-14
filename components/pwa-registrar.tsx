'use client'

import { useEffect } from 'react'

export function PwaRegistrar() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return
    if (!('serviceWorker' in navigator)) return

    navigator.serviceWorker.register('/sw.js').catch(() => {
      // PWA registration should never block the app.
    })
  }, [])

  return null
}
