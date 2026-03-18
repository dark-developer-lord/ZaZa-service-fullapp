import { useQuery, UseQueryOptions } from 'react-query'

import { Api, ApiKeys, getQuery } from '@shared/api'

import { StoreItemForm } from '@entities/stores'

export const useGetStore = (
  id?: number,
  options?: UseQueryOptions<{ data: StoreItemForm }>,
) => {
  return useQuery({
    queryKey: [ApiKeys.Stores.getStore_],
    queryFn: getQuery(Api.getStore_ + id),
    refetchOnMount: false,
    enabled: Boolean(id),
    ...options,
  })
}