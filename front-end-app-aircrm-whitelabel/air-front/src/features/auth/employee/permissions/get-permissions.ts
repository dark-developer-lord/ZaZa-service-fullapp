import { useQuery, UseQueryOptions } from 'react-query'

import { ApiKeys, VendorApi, getQuery } from '@shared/api'

import { getToken, getLSLoginSource } from '@shared/auth'
import { PermissionModules } from '@shared/auth/permissions/modules'

// Employee permissions response structure
interface EmployeePermissionsResponse {
  modules: PermissionModules[]
}

export const useGetEmployeePermissions = (
  options?: UseQueryOptions<PermissionModules[] | string>,
) => {
  return useQuery({
    queryKey: [ApiKeys.Auth.getPermissions],
    queryFn: async () => {
      const response = await getQuery<EmployeePermissionsResponse>(VendorApi.employeePermissions)()
      // Extract modules array from response
      return response.modules
    },
    refetchOnMount: false,
    retry: false,
    enabled: Boolean(getToken()) && getLSLoginSource() === 'vendor-employee',
    ...options,
  })
}
