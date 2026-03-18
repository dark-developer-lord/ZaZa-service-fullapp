import { useQuery, UseQueryOptions } from 'react-query'

import { getApiPaths, Api, ApiKeys, getQuery } from '@shared/api'

import { RestaurantShow, WarehouseShow } from '../model/restaurant'

export const useGetRestaurant = (
  id?: number,
  options?: UseQueryOptions<{ data: RestaurantShow }>,
) => {
  return useQuery({
    queryKey: [ApiKeys.Restaurants.getRestaurant],
    queryFn: getQuery(Api.getRestaurant_ + id),
    refetchOnMount: false,
    enabled: Boolean(id),
    ...options,
  })
}

export const useGetWarehouse = (
  id?: number,
  options?: UseQueryOptions<{ data: WarehouseShow }>,
) => {
  return useQuery({
    queryKey: [ApiKeys.Warehouses.getWarehouse],
    queryFn: getQuery(getApiPaths().getWarehouse_ + id),
    refetchOnMount: false,
    enabled: Boolean(id),
    ...options,
  })
}