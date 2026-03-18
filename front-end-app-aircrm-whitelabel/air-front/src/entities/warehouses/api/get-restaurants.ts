import { useQuery, UseQueryOptions } from 'react-query'

import { Api, ApiKeys, DataWrap, getApiPaths, getQuery } from '@shared/api'

import {
  Warehouse,
  MainRestaurant,
  RestaurantSelect as Restaurant,
  Source,
} from '../model/restaurant'

export const useGetRestaurants = (
  options?: UseQueryOptions<{ data: Restaurant[] }>,
) => {
  return useQuery({
    queryKey: [ApiKeys.Common.restaurants],
    queryFn: getQuery<{ data: Restaurant[] }>(Api.restaurants),
    refetchOnMount: false,
    ...options,
  })
}

export const useGetMainRestaurants = (
  options?: UseQueryOptions<DataWrap<MainRestaurant>>,
) => {
  return useQuery({
    queryKey: [ApiKeys.Restaurants.getMainRestaurants],
    queryFn: getQuery<DataWrap<MainRestaurant>>(Api.getMainRestaurants),
    refetchOnMount: false,
    ...options,
  })
}

export const useGetWarehouses = (
) => {
  return useQuery({
    queryKey: [ApiKeys.Warehouses.getWarehouses],
    queryFn: getQuery<DataWrap<Warehouse>>(getApiPaths().getWarehouses),
    refetchOnMount: false,
  })
}

export const useGetSources = () => {
  return useQuery({
    queryKey: [ApiKeys.Sources.getSources],
    queryFn: getQuery<DataWrap<Source>>(Api.getMainRestaurants),
    refetchOnMount: false,
  })
}
