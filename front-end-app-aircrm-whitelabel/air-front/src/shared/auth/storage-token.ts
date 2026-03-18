import { LoginSource } from './profile-type'
import { clearSaasSession } from './saas-session'

const STORAGE_TOKEN_NAME = import.meta.env.VITE_APP_LS_STORAGE_TOKEN_NAME
const STORAGE_LOGIN_SOURCE_NAME = 'login_source'

export const storageToken = (
  accessToken: string,
  session?: boolean,
  source?: LoginSource,
) => {
  storeToken(Boolean(session), accessToken, source)
}

const storeToken = (
  session: boolean,
  accessToken: string,
  source?: LoginSource,
) => {
  const storage = session ? sessionStorage : localStorage
  storage.setItem(STORAGE_TOKEN_NAME, accessToken)
  if (source) {
    storage.setItem(STORAGE_LOGIN_SOURCE_NAME, source)
  }
}

export const removeToken = () => {
  sessionStorage.removeItem(STORAGE_TOKEN_NAME)
  localStorage.removeItem(STORAGE_TOKEN_NAME)
  sessionStorage.removeItem(STORAGE_LOGIN_SOURCE_NAME)
  localStorage.removeItem(STORAGE_LOGIN_SOURCE_NAME)
  clearSaasSession()
}

export const getToken = () => {
  return (
    sessionStorage.getItem(STORAGE_TOKEN_NAME) ??
    localStorage.getItem(STORAGE_TOKEN_NAME)
  )
}

export const getLSLoginSource = (): LoginSource | undefined => {
  return (sessionStorage.getItem(STORAGE_LOGIN_SOURCE_NAME) ??
    localStorage.getItem(STORAGE_LOGIN_SOURCE_NAME) ??
    undefined) as LoginSource | undefined
}
