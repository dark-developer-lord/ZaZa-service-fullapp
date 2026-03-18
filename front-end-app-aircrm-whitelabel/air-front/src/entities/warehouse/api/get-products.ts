import { useQuery } from 'react-query'

import { ApiKeys, getApiPaths, getQuery } from '@shared/api'

import { ProductItem } from '../model/warehouse'
export const useGetProducts = (warehouse: number, search: string) => {
  return useQuery({
    queryKey: [ApiKeys.WarehouseReports.getProducts,warehouse, search],
    queryFn: getQuery<{ data: ProductItem[] }>(getApiPaths().searchProducts + `warehouse_id=${warehouse}&search=${search}`),
    enabled: search.length > 2,
    keepPreviousData: false
  })
}
