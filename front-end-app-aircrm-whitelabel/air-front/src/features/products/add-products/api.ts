import { useMutation } from 'react-query'
import toast from 'react-hot-toast'
import { AxiosError } from 'axios'

import { api, ApiKeys, queryClient } from '@shared/api'

export interface AddProductsDto {
  product_count: number
  purchase_price: number
}

interface AddProductsResponse {
  message: string
  success: boolean
}

export const useAddProducts = (productId: string | number) => {
  return useMutation({
    mutationKey: [ApiKeys.Products.updateProduct_ + productId, 'add-products'],
    mutationFn: async (dto: AddProductsDto): Promise<AddProductsResponse> => {
      console.log('API call - Product ID:', productId)
      console.log('API call - DTO:', dto)
      console.log('API call - URL:', `/vendor/products/${productId}/add-products`)

      const response = await api.post(`/vendor/products/${productId}/add-products`, dto)
      console.log('API response:', response.data)
      return response.data
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Товар успешно добавлен')
      // Invalidate only the current product data to refetch updated quantity
      queryClient.invalidateQueries([ApiKeys.Products.getProduct_ + productId])
      // Don't redirect, stay on the current edit page
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data.message || 'Произошла ошибка при добавлении товара'
        )
      }
    },
  })
}
