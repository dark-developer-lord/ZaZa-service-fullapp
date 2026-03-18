import { useQuery } from 'react-query'
import { ApiKeys, DataPagination, getQuery } from '@shared/api'

import { useStore } from '../model/store'

export interface ProfitabilityItem {
  id: number
  name: string
  price: number
  purchase_price: number
  profit_per_unit: string
  sales_count: number
  total_profit: string
  profitability: string
  'cost-effectiveness': string | null
}

export const useGetProductProfitability = () => {
  const { paginationModel, searchValue } = useStore()
  const params: { [key: string]: string } = {
    page: (paginationModel.page + 1).toString(),
    per_page: paginationModel.pageSize.toString(),
  }
  if (searchValue.trim()) {
    params.search = searchValue
  }
  const searchParams = new URLSearchParams(params)
  const url = `/vendor/finance/product-profitability?${searchParams.toString()}`

  return useQuery({
      queryKey: [ApiKeys.Products.getFoods, url],
      queryFn: getQuery<DataPagination<ProfitabilityItem>>(url),
      keepPreviousData: true,
  })
}
