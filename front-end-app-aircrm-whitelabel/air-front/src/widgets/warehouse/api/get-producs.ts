import { useQuery } from 'react-query'

import { ProductItem } from '@entities/warehouse/model/warehouse'
import { ApiKeys, DataPagination, getApiPaths, getQuery } from '@shared/api'

import { useProductsStore } from '../model/products-store'

export const useGetProducts = () => {
  const { paginationModel, searchValue, warehouseId } = useProductsStore()
  const params: { [key: string]: string } = {
    page: (paginationModel.page + 1).toString(),
    per_page: paginationModel.pageSize.toString(),
  }
  if (searchValue.trim()) {
    params.search = searchValue
  }
  if (warehouseId) {
    params.warehouse_id = warehouseId.toString()
  }
  const searchParams = new URLSearchParams(params)

  const url = `${getApiPaths().getProducts}?${searchParams.toString()}`

  return useQuery({
      queryKey: [ApiKeys.Products.getProducts, url],
      queryFn: getQuery<DataPagination<ProductItem>>(url),
      keepPreviousData: false,
  })
}