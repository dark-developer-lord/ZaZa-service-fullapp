import { useMutation } from 'react-query'
import { api, VendorApi } from '@shared/api'

export interface StockLookupItem {
  product_id: number
  variation_id?: string
}

export interface StockLookupRequest {
  items: StockLookupItem[]
}

export interface StockLookupResponseItem {
  product_id: number
  variation_id: string | null
  quantity: number
}

export interface StockLookupResponse {
  data: StockLookupResponseItem[]
}

export const useStockLookup = (warehouseId: number | string) => {
  return useMutation({
    mutationFn: async (dto: StockLookupRequest): Promise<StockLookupResponse> => {
      const url = `${VendorApi.warehouseStockLookup_}${warehouseId}/stock-lookup`
      const response = await api.post(url, dto)
      return response.data
    },
  })
}

