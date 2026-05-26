export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api'

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://aptimaster-web.vercel.app'

export const APP_DOWNLOAD_URL =
  'https://drive.google.com/uc?export=download&id=1AFcd6SjilzVb-b1XzIIMS25t6XUoC315'

export type ApiError = Error & { status?: number; data?: unknown }

export const STORAGE_KEYS = {
  token: 'aptirush_token',
  userId: 'aptirush_user_id',
  profileComplete: 'aptirush_profile_complete',
  phone: 'aptirush_phone',
  unauthorizedEvent: 'aptirush:unauthorized',
} as const

const LEGACY_PREFIX = 'apti' + 'master'

const LEGACY_STORAGE_KEYS = {
  token: `${LEGACY_PREFIX}_token`,
  userId: `${LEGACY_PREFIX}_user_id`,
  profileComplete: `${LEGACY_PREFIX}_profile_complete`,
  phone: `${LEGACY_PREFIX}_phone`,
  unauthorizedEvent: `${LEGACY_PREFIX}:unauthorized`,
} as const

export function getStoredToken() {
  if (typeof window === 'undefined') return null
  const token = localStorage.getItem(STORAGE_KEYS.token) || localStorage.getItem(LEGACY_STORAGE_KEYS.token)
  const legacyUserId = localStorage.getItem(LEGACY_STORAGE_KEYS.userId)
  const legacyProfileComplete = localStorage.getItem(LEGACY_STORAGE_KEYS.profileComplete)

  if (token && !localStorage.getItem(STORAGE_KEYS.token)) localStorage.setItem(STORAGE_KEYS.token, token)
  if (legacyUserId && !localStorage.getItem(STORAGE_KEYS.userId)) localStorage.setItem(STORAGE_KEYS.userId, legacyUserId)
  if (legacyProfileComplete && !localStorage.getItem(STORAGE_KEYS.profileComplete)) {
    localStorage.setItem(STORAGE_KEYS.profileComplete, legacyProfileComplete)
  }

  return token
}

export function getStoredPhone() {
  if (typeof window === 'undefined') return null
  const phone = sessionStorage.getItem(STORAGE_KEYS.phone) || sessionStorage.getItem(LEGACY_STORAGE_KEYS.phone)
  if (phone && !sessionStorage.getItem(STORAGE_KEYS.phone)) sessionStorage.setItem(STORAGE_KEYS.phone, phone)
  return phone
}

function getToken() {
  return getStoredToken()
}

export function setSession(token: string, userId?: string, profileComplete?: boolean) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEYS.token, token)
  if (userId) localStorage.setItem(STORAGE_KEYS.userId, userId)
  if (typeof profileComplete === 'boolean') {
    localStorage.setItem(STORAGE_KEYS.profileComplete, String(profileComplete))
  }
}

export function clearSession() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEYS.token)
  localStorage.removeItem(STORAGE_KEYS.userId)
  localStorage.removeItem(STORAGE_KEYS.profileComplete)
  localStorage.removeItem(LEGACY_STORAGE_KEYS.token)
  localStorage.removeItem(LEGACY_STORAGE_KEYS.userId)
  localStorage.removeItem(LEGACY_STORAGE_KEYS.profileComplete)
  sessionStorage.removeItem(STORAGE_KEYS.phone)
  sessionStorage.removeItem(LEGACY_STORAGE_KEYS.phone)
}

function handleUnauthorized() {
  if (typeof window === 'undefined') return
  clearSession()
  window.dispatchEvent(new Event(STORAGE_KEYS.unauthorizedEvent))
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const isForm = options.body instanceof FormData
  const headers = new Headers(options.headers)

  if (!isForm && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json')
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    let data: unknown = null
    try {
      data = await response.json()
    } catch {
      data = await response.text().catch(() => null)
    }
    const message =
      typeof data === 'string'
        ? data
        : data && typeof data === 'object' && 'message' in data
          ? String((data as { message?: unknown }).message)
          : `Request failed with status ${response.status}`
    const error = new Error(message) as ApiError
    error.status = response.status
    error.data = data
    if (response.status === 401 || response.status === 403) {
      handleUnauthorized()
    }
    throw error
  }

  if (response.status === 204) return undefined as T
  const text = await response.text()
  if (!text) return undefined as T
  try {
    return JSON.parse(text) as T
  } catch {
    return text as T
  }
}

export type AuthMe = {
  userId: string
  name: string
  role: string
  profileComplete: boolean
  firstLogin: boolean
}

export type AuthResponse = {
  token?: string
  Token?: string
  userId: string
  message: string
  profileComplete: boolean
  firstLogin: boolean
}

export type Profile = {
  id: string
  name?: string
  age?: number
  avatar?: string
  email?: string
  profileComplete: boolean
  firstLogin: boolean
  examGoal?: string
  target?: string
  dailyGoal?: number
  preferredTopics?: string[]
  totalQuestions: number
  totalCorrect: number
  globalScore: number
  xp: number
  level: number
  streak: number
  accuracy: number
}

export type AnalyticsResponse = {
  totalQuestions: number
  accuracy: number
  trend: number[]
  labels: string[]
  quant: number
  reasoning: number
  verbal: number
  weakTopic?: string
  avgTime: number
}

export type AiSuggestion = {
  suggestedTopic?: string
  accuracy?: number
  reason?: string
}

export type AiExplanation = {
  questionId: string
  explanation: string
  model: string
}

export type Question = {
  id: string
  topic?: string
  subtopic?: string
  difficulty?: string
  questionText: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

export type ResultResponse = {
  totalQuestions: number
  correctAnswers: number
  accuracy: number
  score: number
}

export type LeaderboardEntry = {
  rank: number
  userId: string
  name?: string
  avatar?: string
  points: number
}

export type ContestSummary = {
  id: string
  title?: string
  description?: string
  startTime?: string
  endTime?: string
  durationMinutes?: number
  totalQuestions?: number
  status?: string
  registered?: boolean
  registeredUsers?: number
}

export const authApi = {
  sendOtp: (phone: string) => apiFetch<string>('/auth/send-otp', { method: 'POST', body: JSON.stringify({ phone }) }),
  verifyOtp: (phone: string, otp: string) =>
    apiFetch<AuthResponse>('/auth/verify-otp', { method: 'POST', body: JSON.stringify({ phone, otp }) }),
  me: () => apiFetch<AuthMe>('/auth/me'),
}

export const userApi = {
  profile: () => apiFetch<Profile>('/user/profile'),
  updateProfile: (payload: Partial<Profile>) =>
    apiFetch<Profile>('/user/profile', { method: 'PUT', body: JSON.stringify(payload) }),
  uploadAvatar: (formData: FormData) => apiFetch<{ avatar: string; message: string }>('/user/upload-avatar', { method: 'POST', body: formData }),
}

export const questionApi = {
  byTopic: (topic: string, difficulty: string | null, count: number) => {
    const params = new URLSearchParams({ topic, count: String(count) })
    if (difficulty && difficulty.toLowerCase() !== 'mixed') params.set('difficulty', difficulty.toUpperCase())
    return apiFetch<Question[]>(`/questions/by-topic?${params}`)
  },
  random: (count: number) => apiFetch<Question[]>(`/questions/random?count=${count}`),
  wrong: (count: number) => apiFetch<Question[]>(`/questions/wrong?count=${count}`),
  bookmarked: (count: number) => apiFetch<Question[]>(`/questions/bookmarked?count=${count}`),
  smart: (count: number) => apiFetch<Question[]>(`/questions/smart-practice?count=${count}`),
  subtopics: (topic: string) => apiFetch<string[]>(`/questions/topics?topic=${encodeURIComponent(topic)}`),
  topicStats: (topic: string, userId: string) =>
    apiFetch<Array<{ subtopic: string; totalQuestions: number; solvedQuestions: number; accuracy: number; progress: number; level: string }>>(
      `/questions/topic-stats?topic=${encodeURIComponent(topic)}&userId=${encodeURIComponent(userId)}`,
    ),
  bookmarkStatus: (questionId: string) => apiFetch<{ bookmarked: boolean }>(`/bookmarks/${questionId}/status`),
  toggleBookmark: (questionId: string) => apiFetch<{ bookmarked: boolean }>(`/bookmarks/${questionId}/toggle`, { method: 'POST' }),
}

export const attemptApi = {
  submit: (attempts: Array<{ questionId: string; selectedAnswer: number; timeSpent?: number }>) =>
    apiFetch<ResultResponse>('/attempt/submit', { method: 'POST', body: JSON.stringify({ attempts }) }),
}

export const analyticsApi = {
  weekly: () => apiFetch<AnalyticsResponse>('/analytics/weekly'),
  monthly: () => apiFetch<AnalyticsResponse>('/analytics/30'),
  suggestion: () => apiFetch<AiSuggestion>('/ai/suggest-topic'),
}

export const aiApi = {
  explainQuestion: (questionId: string, selectedAnswer: number | null) =>
    apiFetch<AiExplanation>('/ai/explain-question', {
      method: 'POST',
      body: JSON.stringify({ questionId, selectedAnswer: selectedAnswer ?? -1 }),
    }),
}

export const leaderboardApi = {
  list: (period: 'daily' | 'weekly' | 'global', page = 0, limit = 20) =>
    apiFetch<LeaderboardEntry[]>(`/leaderboard/${period}?page=${page}&limit=${limit}`),
  search: (query: string) => apiFetch<LeaderboardEntry[]>(`/leaderboard/search?query=${encodeURIComponent(query)}`),
  rank: (userId: string) => apiFetch<number>(`/leaderboard/rank/${userId}`),
}

export const contestApi = {
  list: (type: 'live' | 'upcoming' | 'past') => apiFetch<ContestSummary[]>(`/contests?type=${type}`),
  register: (contestId: string) => apiFetch<{ contestId: string; registered: boolean; registeredUsers: number }>(`/contests/${contestId}/register`, { method: 'POST' }),
}

export function getApiMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) return error.message
  return fallback
}
