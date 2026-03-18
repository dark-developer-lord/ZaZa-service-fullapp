import { useQuery } from 'react-query'

import { useOrdersFilterStore } from '@features/orders'
import { Order } from '@entities/orders/model/order-type'
import { Api, DataPagination, getQuery } from '@shared/api'
import { useProfile } from '@shared/auth'

import { dtoToQuery } from './filter-dto'

export const useGetOrders = () => {
  const {
    paginationModel,
    searchValue,
    statuses,
    date,
    restaurantId,
    warehouseId,
    activeKey,
    hasInstallment,
  } = useOrdersFilterStore()
  const source = useProfile((profile) => profile.source)
  const params: { [key: string]: string } = {
    page: (paginationModel.page + 1).toString(),
    per_page: paginationModel.pageSize.toString(),
  }
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
  let url = `${source === 'admin' ? Api.orders : Api.restaurantOrders}?${searchParams.toString()}`
  if (filterParams.toString()) {
    url += `&${filterParams.toString()}`
  }

  return useQuery({
    queryFn: getQuery<DataPagination<Order>>(url),
    queryKey: [url],
    keepPreviousData: true,
  })
}
