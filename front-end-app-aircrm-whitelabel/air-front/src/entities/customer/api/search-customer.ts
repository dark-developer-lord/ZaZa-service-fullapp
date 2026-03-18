import { useQuery } from 'react-query'

import { Api, ApiKeys, getApiPaths, getQuery } from '@shared/api'

import { SearchCustomer } from '../model/search-customer'

export const useSearchCustomer = (search: string) => {
  return useQuery({
    queryKey: [ApiKeys.Common.searchCustomer + search],
    queryFn: getQuery<{ data: SearchCustomer[] }>(getApiPaths().searchCustomer + search),
    enabled: search.length > 2,
  })
}
