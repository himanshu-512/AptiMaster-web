'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authApi, clearSession, getStoredToken, setSession, STORAGE_KEYS, type AuthMe } from '@/lib/api'

type AuthContextValue = {
  user: AuthMe | null
  token: string | null
  loading: boolean
  refresh: () => Promise<void>
  login: (token: string, userId: string, profileComplete: boolean) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [token, setTokenValue] = useState<string | null>(null)
  const [user, setUser] = useState<AuthMe | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = async () => {
    const storedToken = getStoredToken()
    setTokenValue(storedToken)
    if (!storedToken) {
      setUser(null)
      setLoading(false)
      return
    }

    try {
      const me = await authApi.me()
      setUser(me)
      localStorage.setItem(STORAGE_KEYS.profileComplete, String(Boolean(me.profileComplete)))
    } catch {
      clearSession()
      setTokenValue(null)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  useEffect(() => {
    const handleUnauthorized = () => {
      setTokenValue(null)
      setUser(null)
      setLoading(false)
      router.replace('/')
    }

    window.addEventListener(STORAGE_KEYS.unauthorizedEvent, handleUnauthorized)
    return () => window.removeEventListener(STORAGE_KEYS.unauthorizedEvent, handleUnauthorized)
  }, [router])

  const login = async (newToken: string, userId: string, profileComplete: boolean) => {
    setSession(newToken, userId, profileComplete)
    setTokenValue(newToken)
    await refresh()
    router.replace('/dashboard')
  }

  const logout = () => {
    clearSession()
    setTokenValue(null)
    setUser(null)
    router.replace('/')
  }

  const value = useMemo(() => ({ user, token, loading, refresh, login, logout }), [user, token, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used inside AuthProvider')
  return value
}

export function useRequireAuth() {
  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!auth.loading && !auth.token) router.replace('/')
  }, [auth.loading, auth.token, router])

  return auth
}
