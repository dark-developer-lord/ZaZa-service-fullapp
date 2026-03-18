import { useQuery, UseQueryOptions } from 'react-query'

import { ApiKeys, getApiPaths, getQuery } from '@shared/api'

import { getSaasModules, getSaasTenantId } from '../saas-session'
import { getToken, getLSLoginSource } from '../storage-token'
import { PermissionModules } from './modules'

// Employee permissions response structure
interface EmployeePermissionsResponse {
  modules: PermissionModules[]
}

export const useGetPermissions = (
  options?: UseQueryOptions<PermissionModules[] | string>,
) => {
  const loginSource = getToken() ? getLSLoginSource() : undefined
  const tenantId = loginSource === 'saas' ? getSaasTenantId() : null

  const mapSaasModule = (code: string): PermissionModules[] => {
    switch (code) {
      case 'dashboard':
        return [PermissionModules.dashboard, PermissionModules.posTerminal]
      case 'orders':
      case 'appointments':
        return [PermissionModules.order]
      case 'warehouse':
      case 'products':
      case 'inventory':
        return [PermissionModules.warehouse, PermissionModules.food]
      case 'customers':
        return [PermissionModules.customer]
      case 'finance':
        return [PermissionModules.finance]
      case 'channels':
        return [PermissionModules.channels, PermissionModules.chats]
      case 'couriers':
        return [PermissionModules.deliveryman]
      case 'staff':
        return [PermissionModules.employee]
      case 'services':
        return [PermissionModules.posTerminal]
      default:
        return []
    }
  }

  // Determine the correct permissions endpoint based on login source
  const getPermissionsEndpoint = () => {
    const apiPaths = getApiPaths()
    if (loginSource === 'vendor-employee') {
      return (apiPaths as any).employeePermissions
    }
    return (apiPaths as any).getPermissions
  }

  // SaaS permissions come from localStorage — no network call needed.
  // Return them immediately via initialData so the query never fires a request.
  const saasPermissions: PermissionModules[] | undefined =
    loginSource === 'saas'
      ? Array.from(
          new Set(
            getSaasModules()
              .filter((m) => m.enabled)
              .flatMap((m) => mapSaasModule(m.code)),
          ),
        )
      : undefined

  return useQuery({
    queryKey: [ApiKeys.Auth.getPermissions, loginSource === 'saas' ? tenantId : 'default'],
    queryFn: async (): Promise<PermissionModules[] | string> => {
      if (loginSource === 'vendor-employee') {
        // Handle employee permissions response structure
        const response = await getQuery<EmployeePermissionsResponse>(getPermissionsEndpoint())()
        return response.modules
      }
      // Handle regular vendor/admin permissions response
      const response = await getQuery<PermissionModules[] | string>(getPermissionsEndpoint())()
      return response
    },
    refetchOnMount: false,
    retry: false,
    // For SaaS: permissions come from localStorage, no network call needed.
    // initialData makes react-query skip the queryFn entirely and treat
    // the data as already fetched (staleTime Infinity prevents re-fetching).
    initialData: saasPermissions,
    enabled: Boolean(getToken()) && loginSource !== 'saas',
    staleTime: loginSource === 'saas' ? Infinity : undefined,
    ...options,
  })
}
