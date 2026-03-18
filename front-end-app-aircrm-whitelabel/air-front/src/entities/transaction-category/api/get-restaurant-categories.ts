import { useQuery, UseQueryOptions } from 'react-query'

import { getApiPaths, Api, ApiKeys, getQuery } from '@shared/api'

import { Category } from '../model/category'

export const useGetRestaurantCategories = (
  restaurantId?: number | null,
  options?: UseQueryOptions<{
    data: Category[]
  }>,
) => {
  return useQuery({
    queryKey: [ApiKeys.Common.restaurantCategories_ + restaurantId],
    queryFn: getQuery(Api.restaurantCategories_ + restaurantId),
    enabled: Boolean(restaurantId),
    ...options,
  })
}

export const useGetWarehouseCategories = (
  warehouseId?: number | null,
  options?: UseQueryOptions<{
    data: Category[]
  }>,
) => {
  return useQuery({
    queryKey: [ApiKeys.Common.warehouseCategories_ + warehouseId],
    queryFn: getQuery(getApiPaths().warehouseCategories_ + warehouseId),
    enabled: Boolean(warehouseId),
    ...options,
  })
}
