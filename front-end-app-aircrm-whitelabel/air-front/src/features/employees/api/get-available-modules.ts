import { useQuery } from 'react-query'

import { getApiPaths, getQuery, ApiKeys } from '@shared/api'

export interface AvailableModule {
  key: string
  name: string
}

interface AvailableModulesResponse {
  success: boolean
  data: AvailableModule[]
}

export const useGetAvailableModules = () => {
  return useQuery({
    queryKey: [ApiKeys.Employees.getAvailableModules],
    queryFn: getQuery<AvailableModulesResponse>(getApiPaths().getAvailableModules),
    select: (data) => data.data,
  })
}
