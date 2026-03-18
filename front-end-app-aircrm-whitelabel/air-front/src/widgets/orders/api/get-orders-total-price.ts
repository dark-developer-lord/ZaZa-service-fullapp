import { useQuery } from 'react-query'

import { useOrdersFilterStore } from '@features/orders'
import { getApiPaths, ApiKeys, getQuery } from '@shared/api'
import { useProfile } from '@shared/auth'

import { dtoToQuery } from './filter-dto'

interface TotalPriceResponse {
  total_price: string | number // Backend sends string like "137919.00"
  total_orders?: number
}

export const useGetOrdersTotalPrice = () => {
  const {
    searchValue,
    statuses,
    date,
    restaurantId,
    warehouseId,
    activeKey,
    hasInstallment,
  } = useOrdersFilterStore()
  
  const source = useProfile((profile) => profile.source)
  
  // Always fetch total price (both initially and when filters are applied)
  // No need to check for filters - we want to show total always

  const params: { [key: string]: string } = {}
  
  if (searchValue.trim()) {
    params.search = searchValue
  }
  
  const searchParams = new URLSearchParams(params)
  const filterParams = dtoToQuery({
    status: statuses,
    restaurantId,
    warehouseId,
    date,
    duration: activeKey,
    hasInstallment,
  })
  
  let url = `${source === 'admin' ? getApiPaths().countTotalPrice : getApiPaths().countTotalPrice}?${searchParams.toString()}`
  if (filterParams.toString()) {
    url += `&${filterParams.toString()}`
  }

  return useQuery({
    queryFn: getQuery<TotalPriceResponse>(url),
    queryKey: [ApiKeys.Orders.countTotalPrice, url],
    keepPreviousData: true,
  })
}
