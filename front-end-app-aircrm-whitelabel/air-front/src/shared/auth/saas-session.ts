import { SaasProfile } from './profile-type'

const SAAS_TENANT_KEY = 'saas_tenant'
const SAAS_MODULES_KEY = 'saas_modules'
const SAAS_PROFILE_KEY = 'saas_profile'

export interface SaasModule {
  code: string
  name: string
  group: string
  enabled: boolean
}

export interface SaasTenant {
  id: number
  name: string
  slug: string
  sector_type: 'goods' | 'services'
  panel_preset: 'goods' | 'services'
  timezone: string
  currency: string
  is_active: boolean
  modules?: SaasModule[]
}

interface SaasAuthPayload {
  user: {
    id: number
    name: string
    email: string
    phone: string
  }
  tenant: SaasTenant
  modules?: SaasModule[]
}

const normalizeProfile = (user: SaasAuthPayload['user']): SaasProfile => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone,
})

const readStorage = (key: string) =>
  sessionStorage.getItem(key) ?? localStorage.getItem(key)

const parseJson = <T>(value: string | null): T | null => {
  if (!value) {
    return null
  }

  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}

export const storeSaasSession = (payload: SaasAuthPayload, session = false) => {
  const storage = session ? sessionStorage : localStorage

  storage.setItem(SAAS_PROFILE_KEY, JSON.stringify(normalizeProfile(payload.user)))
  storage.setItem(SAAS_TENANT_KEY, JSON.stringify(payload.tenant))
  storage.setItem(
    SAAS_MODULES_KEY,
    JSON.stringify(payload.tenant.modules ?? payload.modules ?? []),
  )
}

export const setActiveSaasTenant = (tenant: SaasTenant, session = false) => {
  const storage = session ? sessionStorage : localStorage
  storage.setItem(SAAS_TENANT_KEY, JSON.stringify(tenant))
  storage.setItem(SAAS_MODULES_KEY, JSON.stringify(tenant.modules ?? []))
}

export const getSaasProfile = (): SaasProfile | null => {
  return parseJson<SaasProfile>(readStorage(SAAS_PROFILE_KEY))
}

export const getSaasTenant = (): SaasTenant | null => {
  return parseJson<SaasTenant>(readStorage(SAAS_TENANT_KEY))
}

export const getSaasTenantId = (): number | null => {
  return getSaasTenant()?.id ?? null
}

export const getSaasModules = (): SaasModule[] => {
  return parseJson<SaasModule[]>(readStorage(SAAS_MODULES_KEY)) ?? []
}

export const clearSaasSession = () => {
  sessionStorage.removeItem(SAAS_TENANT_KEY)
  localStorage.removeItem(SAAS_TENANT_KEY)
  sessionStorage.removeItem(SAAS_MODULES_KEY)
  localStorage.removeItem(SAAS_MODULES_KEY)
  sessionStorage.removeItem(SAAS_PROFILE_KEY)
  localStorage.removeItem(SAAS_PROFILE_KEY)
}
