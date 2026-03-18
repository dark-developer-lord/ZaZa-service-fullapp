import { useQuery } from 'react-query'

import { RestaurantItem, WarehouseItem } from '@entities/warehouses'

import { Api, getApiPaths, ApiKeys, DataPagination, getQuery } from '@shared/api'

import { useStore } from '../model/store'

export const useGetRestaurants = () => {
  const { paginationModel, searchValue } = useStore()
  const params: { [key: string]: string } = {
    page: (paginationModel.page + 1).toString(),
    per_page: paginationModel.pageSize.toString(),
  }
  if (searchValue.trim()) {
    params.search = searchValue
  }
  const searchParams = new URLSearchParams(params)
  const url = `${Api.getRestaurants}?${searchParams.toString()}`

  return useQuery({
    queryKey: [ApiKeys.Restaurants.getRestaurants, url],
    queryFn: getQuery<DataPagination<RestaurantItem>>(url),
    keepPreviousData: true,
  })
}

export const useGetWarehouses = () => {
  const { paginationModel, searchValue } = useStore()
  const params: { [key: string]: string } = {
    page: (paginationModel.page + 1).toString(),
    per_page: paginationModel.pageSize.toString(),
  }
  if (searchValue.trim()) {
    params.search = searchValue
  }
  const searchParams = new URLSearchParams(params)
  const url = `${getApiPaths().getWarehousesList}?${searchParams.toString()}`

  return useQuery({
    queryKey: [ApiKeys.Warehouses.getWarehousesList, url],
    queryFn: getQuery<DataPagination<WarehouseItem>>(url),
    keepPreviousData: true,
  })
}