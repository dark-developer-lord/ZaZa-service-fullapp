import { useQuery } from 'react-query'

import { ApiKeys, getQuery, VendorApi } from '@shared/api'

interface CounterpartyType {
  value: string
  label: string
}

export const useGetCounterpartyTypes = () => {
  return useQuery({
    queryKey: [ApiKeys.Counterparties.getCounterpartyTypes],
    queryFn: getQuery<{ types: CounterpartyType[] }>(VendorApi.getCounterpartyTypes),
    refetchOnMount: false,
  })
}

