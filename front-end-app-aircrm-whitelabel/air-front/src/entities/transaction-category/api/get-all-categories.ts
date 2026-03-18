import { useQuery } from 'react-query'

import { ApiKeys, getApiPaths, getQuery } from '@shared/api'

import { CategoryItem } from '../model/category'

export const useGetAllCategories = (storeId?: (number | null)) => {
  return useQuery({
    queryKey: ApiKeys.Categories.getAllCategories,
    queryFn: getQuery<{ data: CategoryItem[] }>(getApiPaths().getAllCategories + `${storeId ? `?store_id=${storeId}` : ''}`),
    refetchOnMount: false,
  })
}
