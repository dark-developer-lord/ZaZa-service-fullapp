import toast from 'react-hot-toast'
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'

import { getLSLoginSource, getSaasTenantId, getToken, removeToken } from '../auth'

const MAX_RETRIES = 3

function retryDelayMs(retryCount: number) {
  return Math.min(1000 * 2 ** (retryCount - 1), 10_000)
}

function shouldRetry(error: AxiosError): boolean {
  const status = error.response?.status
  if (status === 401 || status === 403) return false
  if (!error.response) return true // network / no response
  if (status === 503 || status === 502 || status === 504) return true
  return axios.isAxiosError(error) && error.code === 'ECONNABORTED'
}

/** Same as axios-retry onRetry: first retry attempt shows reconnect toast */
function onRetry(retryCount: number) {
  if (retryCount === 1) {
    toast.loading('Переподключение к серверу...', { id: 'retry-toast' })
  }
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL + '/v3',
  timeout: 15_000,
})

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  if (getLSLoginSource() === 'saas') {
    const tenantId = getSaasTenantId()
    if (tenantId) {
      config.headers['X-Tenant-Id'] = tenantId
    }
  }

  return config
})

api.interceptors.response.use(
  (config) => {
    return config
  },
  (error) => {
    if (error.response?.status === 401) {
      const isSaas = getLSLoginSource() === 'saas'
      removeToken()
      if (!window.location.pathname.startsWith('/auth')) {
        window.location.href = isSaas ? '/auth/saas/login' : '/auth/login'
      }
    }
    // Clear the retry toast if it was shown
    toast.dismiss('retry-toast')

    if (error instanceof AxiosError) {
      if (error.code === 'ERR_NETWORK') {
        toast.error('Нет подключения к интернету', { id: 'network-error' })
      } else if (error.code === 'ECONNABORTED' || error.code === 'ERR_CANCELED') {
        toast.error('Запрос занял слишком много времени. Попробуйте снова.', { id: 'timeout-error' })
      } else if (error.response?.status === 503) {
        toast.error('Сервер временно недоступен. Повторяем...', { id: 'server-error' })
      }
    }
    throw error
  },
)

// Registered after 401 handler so this runs first on errors (axios invokes last-added reject first)
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as (InternalAxiosRequestConfig & { __retryCount?: number }) | undefined
    if (!config) throw error

    const attempt = config.__retryCount ?? 0
    if (!shouldRetry(error) || attempt >= MAX_RETRIES) {
      throw error
    }

    config.__retryCount = attempt + 1
    onRetry(config.__retryCount)
    await new Promise((r) => setTimeout(r, retryDelayMs(config.__retryCount!)))
    try {
      const res = await api.request(config)
      toast.dismiss('retry-toast')
      return res
    } catch (e) {
      // will retry again or fall through to outer error handler (dismisses toast)
      throw e
    }
  },
)
