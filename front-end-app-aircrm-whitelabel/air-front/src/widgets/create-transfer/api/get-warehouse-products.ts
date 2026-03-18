import { useQuery } from 'react-query'
import { ApiKeys, getApiPaths, getQuery, DataPagination } from '@shared/api'
import { Food } from '@entities/finance/model/food'

interface Params {
  warehouseId: number | ''
  search: string
  page: number
  perPage?: number
}

export const useGetWarehouseProducts = ({ warehouseId, search, page, perPage = 16 }: Params) => {
  const params: { [key: string]: string } = {
    page: page.toString(),
    per_page: (perPage || 16).toString(),
  }
  
  if (search.trim()) {
    params.search = search
  }
  
  const searchParams = new URLSearchParams(params)
  const url = warehouseId 
    ? `${getApiPaths().searchWarehouseProducts_}${warehouseId}/products?${searchParams.toString()}`
    : ''

  return useQuery({
    queryKey: [ApiKeys.WarehouseReports.getProducts, warehouseId, url],
    queryFn: getQuery<DataPagination<Food>>(url),
    enabled: Boolean(warehouseId),
    keepPreviousData: true,
  })
}

