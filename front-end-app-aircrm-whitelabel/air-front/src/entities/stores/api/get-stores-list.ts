import { useQuery } from 'react-query'

import { Api, ApiKeys, DataWrap, getQuery } from '@shared/api'

interface StoreItem {
    id: number
    name: string
}

export const useGetStoresList = (
) => {
  return useQuery({
    queryKey: [ApiKeys.Stores.getStoresList],
    queryFn: getQuery<DataWrap<StoreItem>>(Api.getStoresList),
    refetchOnMount: false,
  })
}