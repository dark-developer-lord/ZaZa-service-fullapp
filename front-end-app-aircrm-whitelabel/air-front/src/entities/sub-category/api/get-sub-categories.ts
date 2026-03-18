import { useQuery, UseQueryOptions } from 'react-query'

import { ApiKeys, getApiPaths, getQuery } from '@shared/api'

import { SubCategory } from '../model/sub-category'

export const useGetSubCategories = (
  categoryId?: number | null,
  options?: UseQueryOptions<{
    data: SubCategory[]
  }>,
) => {
  return useQuery({
    queryKey: [ApiKeys.Categories.getCategorySubcategories_ + categoryId],
    queryFn: getQuery(getApiPaths().getCategorySubcategories_ + categoryId),
    enabled: Boolean(categoryId),
    ...options,
  })
}
