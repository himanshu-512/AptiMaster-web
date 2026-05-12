'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authApi, clearSession, setSession, type AuthMe } from '@/lib/api'

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
    const storedToken = localStorage.getItem('aptimaster_token')
    setTokenValue(storedToken)
    if (!storedToken) {
      setUser(null)
      setLoading(false)
      return
    }

    try {
      const me = await authApi.me()
      setUser(me)
      localStorage.setItem('aptimaster_profile_complete', String(Boolean(me.profileComplete)))
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
