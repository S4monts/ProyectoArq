// frontend/src/services/api.ts
import axios from 'axios'
import type {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios'

const BASE_URL = (typeof window !== 'undefined' && import.meta.env.VITE_API_URL)
  ? import.meta.env.VITE_API_URL
  : 'http://localhost:4000/api'
const ACCESS_TOKEN_KEY = 'medicor_access_token'
const DEFAULT_TIMEOUT = 15_000 // ms

export function getAccessToken(): string | null {
  try {
    return typeof window !== 'undefined' ? localStorage.getItem(ACCESS_TOKEN_KEY) : null
  } catch {
    return null
  }
}
export function setAccessToken(token: string | null) {
  try {
    if (typeof window === 'undefined') return
    if (token) localStorage.setItem(ACCESS_TOKEN_KEY, token)
    else localStorage.removeItem(ACCESS_TOKEN_KEY)
  } catch {
    // noop
  }
}

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // útil si usas refresh token en httpOnly cookie
  timeout: DEFAULT_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

/** Request interceptor */
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken()
  if (token) {
    if (!config.headers) config.headers = {} as Record<string, string>
    ;(config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
  }
  return config
})

let isRefreshing = false
let failedQueue: {
  resolve: (value?: any) => void
  reject: (error: any) => void
}[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(p => {
    if (error) p.reject(error)
    else p.resolve(token)
  })
  failedQueue = []
}

const REFRESH_URL = '/auth/refresh'

async function refreshAccessToken(): Promise<string> {
  // Nota: se usa axios.post directo para evitar el interceptor de la instancia principal
  const res = await axios.post(`${BASE_URL}${REFRESH_URL}`, {}, { withCredentials: true, timeout: DEFAULT_TIMEOUT })
  const newToken = res.data?.accessToken ?? res.data?.access_token
  if (!newToken) throw new Error('No access token in refresh response')
  setAccessToken(newToken)
  return newToken
}

/** Response interceptor */
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<any>) => {
    // errores sin respuesta (network)
    if (!error.response) {
      // opcional: mostrar toast "Sin conexión" o similar
      return Promise.reject({ ...error, friendlyMessage: 'Network error' })
    }

    const status = error.response.status
    const originalRequest = (error.config as InternalAxiosRequestConfig & { _retry?: boolean })

    // Si no es 401, pasar el error normal (pero puedes manejar 403/429 aquí)
    if (status !== 401) {
      // ejemplo: manejo centralizado para 403
      if (status === 403) {
        // podrías mostrar un mensaje o logear evento
      }
      return Promise.reject(error)
    }

    // evadir loop
    if (originalRequest._retry) {
      return Promise.reject(error)
    }

    // si ya se está refrescando, poner en cola
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      })
        .then((token) => {
          if (!originalRequest.headers) originalRequest.headers = {} as Record<string, string>
          ;(originalRequest.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
          originalRequest._retry = true
          return api(originalRequest)
        })
        .catch(err => Promise.reject(err))
    }

    originalRequest._retry = true
    isRefreshing = true

    return new Promise(async (resolve, reject) => {
      try {
        const newToken = await refreshAccessToken()
        processQueue(null, newToken)
        if (!originalRequest.headers) originalRequest.headers = {} as Record<string, string>
        ;(originalRequest.headers as Record<string, string>)['Authorization'] = `Bearer ${newToken}`
        resolve(api(originalRequest))
      } catch (err) {
        processQueue(err, null)
        setAccessToken(null)
        // comportamiento recomendado: forzar logout / redirigir a login
        if (typeof window !== 'undefined') {
          // limpia y redirige
          try { localStorage.removeItem(ACCESS_TOKEN_KEY) } catch {}
          window.location.href = '/login' // o usa tu router
        }
        reject(err)
      } finally {
        isRefreshing = false
      }
    })
  }
)

/** Utilities / API helpers (ejemplos) */
export const authService = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }).then(res => {
      // si backend devuelve access token en body
      const token = res.data?.accessToken ?? res.data?.access_token
      if (token) setAccessToken(token)
      return res.data
    }),
  logout: () =>
    api.post('/auth/logout').then(res => {
      setAccessToken(null)
      return res.data
    }),
  refresh: () => refreshAccessToken(),
}

export const patientsService = {
  list: (params?: Record<string, any>) => api.get('/patients', { params }).then(r => r.data),
  get: (id: string) => api.get(`/patients/${id}`).then(r => r.data),
  create: (payload: any) => api.post('/patients', payload).then(r => r.data),
}

/** Eject interceptors helper (útil para tests/hmr) */
export function ejectInterceptors() {
  // @ts-ignore - no typing for interceptors id here, se asume último agregado
  api.interceptors.request.handlers = []
  api.interceptors.response.handlers = []
}

export default api
