import { useQuery } from 'react-query'

import { ApiKeys, getQuery, VendorApi } from '@shared/api'

export interface CycleType {
  value: string
  label: string
}

interface CycleTypesResponse {
  cycle_types: CycleType[]
}

export const useGetCycleTypes = () => {
  return useQuery({
    queryKey: [ApiKeys.CashFlow.getCycleTypes],
    queryFn: getQuery<CycleTypesResponse>(VendorApi.getCycleTypes),
    refetchOnMount: false,
    select: (response) => response.cycle_types,
  })
}

