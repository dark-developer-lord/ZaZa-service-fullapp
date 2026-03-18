import { useQuery } from 'react-query'

import { ApiKeys, getApiPaths, getQuery } from '@shared/api'

export interface ProductVariation {
  id: number
  variation_id: string
  variation_type: string
  attribute_id: number
  attribute_value: string
  cost_price: number
  sale_price: number
  quantity: number
  barcode: string
}

export interface WarehouseProductItem {
  id: number
  warehouse_id: number
  product_id: number
  quantity: string
  purchase_price: number
  retail_price: number
  product_code: string | null
  product_name: string
  image: string | null
  category: {
    id: number
    name: string
  } | null
  subcategory: {
    id: number
    name: string
  } | null
  variation_name: string
  variations: ProductVariation[]
}

export const useSearchWarehouseProducts = (warehouseId: number, search: string) => {
  return useQuery({
    queryKey: [ApiKeys.WarehouseReports.getProducts, warehouseId, search],
    queryFn: getQuery<{ data: WarehouseProductItem[] }>(
      `${getApiPaths().searchWarehouseProducts_}${warehouseId}/products?search=${search}`
    ),
    enabled: Boolean(warehouseId) && search.length >= 2,
    keepPreviousData: false,
    refetchOnWindowFocus: false,
  })
}
