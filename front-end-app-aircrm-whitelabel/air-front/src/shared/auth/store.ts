import { create } from 'zustand'

import { LoginSource, Profile, VendorProfile, EmployeeProfile, SaasProfile } from './profile-type'

interface State {
  loading: boolean
  accessToken: string | null
  source: LoginSource
  profile: Profile | VendorProfile | EmployeeProfile | SaasProfile | null
}

interface Action {
  authorize: (accessToken: string) => void
  setProfile: (profile: Profile | VendorProfile | EmployeeProfile | SaasProfile, source: LoginSource) => void
  logout: () => void
}

export const useProfile = create<State & Action>((set) => ({
  loading: true,
  accessToken: null,
  profile: null,
  source: 'admin',
  authorize(accessToken) {
    set(() => ({ accessToken, loading: false }))
  },
  setProfile(profile, source) {
    set(() => ({ profile, source }))
  },
  logout() {
    set(() => ({
      accessToken: null,
      loading: false,
      profile: null,
      source: 'admin',
    }))
    // Remove only auth-specific keys — never wipe unrelated app state
    const authKeys = [
      import.meta.env.VITE_APP_LS_STORAGE_TOKEN_NAME,
      import.meta.env.VITE_APP_LS_LOGIN_SOURCE_NAME,
      'saas_tenant',
      'saas_modules',
      'saas_profile',
      'vendor_panels',
    ]
    authKeys.forEach((key) => { if (key) localStorage.removeItem(key) })
    sessionStorage.clear()
  },
}))

export const useGetLoginSource = () => {
  return useProfile((profile) => profile.source)
}
