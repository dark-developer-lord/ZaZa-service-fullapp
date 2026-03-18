import { useQuery } from 'react-query'
import { GridPaginationModel } from '@mui/x-data-grid'

import { getApiPaths, ApiKeys, getQuery, DataPagination } from '@shared/api'

import { CustomerLoyaltyPoint } from '../model/customer-loyalty-points'

interface CustomerLoyaltyPointsParams {
  customerId: string | number
  paginationModel: GridPaginationModel
  enabled?: boolean
}

export const useGetCustomerLoyaltyPoints = ({ customerId, paginationModel, enabled = true }: CustomerLoyaltyPointsParams) => {
  const params = new URLSearchParams({
    page: (paginationModel.page + 1).toString(),
    per_page: paginationModel.pageSize.toString(),
  })
  const url = `${getApiPaths().getCustomers}/${customerId}/loyalty-points?${params.toString()}`

  return useQuery({
    queryFn: getQuery<DataPagination<CustomerLoyaltyPoint>>(url),
    queryKey: [ApiKeys.Customers.getCustomers, 'loyalty-points', customerId, paginationModel.page, paginationModel.pageSize],
    enabled: !!customerId && enabled,
    keepPreviousData: true,
  })
}
