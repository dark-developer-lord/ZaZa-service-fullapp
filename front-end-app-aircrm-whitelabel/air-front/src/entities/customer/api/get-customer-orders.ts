import { useQuery } from 'react-query'

import { getApiPaths, ApiKeys, getQuery, DataPagination } from '@shared/api'

import { CustomerOrderHistory } from '../model/customer-order-history'

interface CustomerOrdersParams {
  customerId: string | number
  paginationModel: { page: number; pageSize: number }
  imported?: boolean
}

export const useGetCustomerOrders = ({ customerId, paginationModel, imported }: CustomerOrdersParams) => {
  const params = new URLSearchParams({
    page: (paginationModel.page + 1).toString(),
    per_page: paginationModel.pageSize.toString(),
  })

  if (imported) {
    params.append('imported', 'true')
  }

  const url = `${getApiPaths().getCustomers}/${customerId}/general-info?${params.toString()}`

  return useQuery({
    queryFn: getQuery<DataPagination<CustomerOrderHistory>>(url),
    queryKey: [ApiKeys.Customers.getCustomers, 'orders', customerId, paginationModel.page, paginationModel.pageSize, imported],
    enabled: !!customerId,
    keepPreviousData: true,
  })
}
