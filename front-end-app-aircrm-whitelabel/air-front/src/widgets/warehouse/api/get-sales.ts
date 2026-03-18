import { useQuery } from 'react-query'

import { SaleItem } from '@entities/warehouse/model/warehouse'
import { ApiKeys, DataPagination, getApiPaths, getQuery } from '@shared/api'

import { useSaleStore } from '../model/sales-store'

export const useGetSales = () => {
  const { paginationModel, searchValue } = useSaleStore()
  const params: { [key: string]: string } = {
    page: (paginationModel.page + 1).toString(),
    per_page: paginationModel.pageSize.toString(),
  }
  if (searchValue.trim()) {
    params.search = searchValue
  }
  const searchParams = new URLSearchParams(params)

  const url = `${getApiPaths().getSales}?${searchParams.toString()}`

  return useQuery({
      queryKey: [ApiKeys.WarehouseReports.getSales, url],
      queryFn: getQuery<DataPagination<SaleItem>>(url),
      keepPreviousData: false,
  })
}