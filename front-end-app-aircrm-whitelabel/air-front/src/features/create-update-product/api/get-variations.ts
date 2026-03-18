import { useQuery } from 'react-query'

import { getQuery, VendorApi, ApiKeys } from '@shared/api'

interface VariationType {
  value: number
  label: string
}

interface VariationsResponse {
  types: VariationType[]
}

export const useGetVariations = () => {
  return useQuery({
    queryKey: [ApiKeys.Products.getVariations],
    queryFn: getQuery<VariationsResponse>(VendorApi.getVariations),
    refetchOnMount: false,
  })
}
