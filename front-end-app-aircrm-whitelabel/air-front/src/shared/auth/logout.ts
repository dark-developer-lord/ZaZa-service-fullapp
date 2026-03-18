import { useMutation } from 'react-query'
// import { useNavigate } from 'react-router-dom'

import { Api, api, ApiKeys, getApiPaths } from '../api'
import { removeToken } from '../auth'
import { useProfile } from './index'
import { getLSLoginSource } from './storage-token'

export const useLogout = () => {
  const logout = useProfile((state) => state.logout)
  const loginSource = getLSLoginSource()
  // const navigate = useNavigate()

  const onFinally = () => {
    logout()
    removeToken()
    window.location.href = loginSource === 'saas' ? '/auth/saas/login' : '/auth/login'
  }

  // Determine the correct logout endpoint based on login source
  const getLogoutEndpoint = () => {
    const apiPaths = getApiPaths()
    if (loginSource === 'saas') {
      return Api.saasLogout
    }
    if (loginSource === 'vendor-employee') {
      return (apiPaths as any).employeeLogout
    }
    return Api.logout
  }

  const { isLoading, mutateAsync } = useMutation({
    mutationKey: [ApiKeys.Auth.logout],
    mutationFn: () => api.get(getLogoutEndpoint()),
    onSuccess: onFinally,
    onError: onFinally,
  })

  return { isLoading, mutate: mutateAsync }
}
