import { useMutation } from 'react-query'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { AxiosError } from 'axios'

import { ApiKeys, putQuery, queryClient, getApiPaths } from '@shared/api'
import { RouterPaths } from '@shared/lib'

export interface TransferProductVariationDto {
  variation_id: string
  quantity: number
  cost_price?: number
  sale_price?: number
}

export interface TransferProductDto {
  product_id: number
  variations?: TransferProductVariationDto[]
  // For products without variations
  quantity?: number
  cost_price?: number
  sale_price?: number
}

export interface UpdateTransferDto {
  name?: string
  transfer_type: string
  from_warehouse_id: number
  to_warehouse_id?: number
  to_vendor_id?: number
  products: TransferProductDto[]
}

export const useUpdateTransfer = (id: string | undefined) => {
  const navigate = useNavigate()

  return useMutation({
    mutationKey: [ApiKeys.WarehouseReports.updateTransfer_ + id],
    mutationFn: putQuery<UpdateTransferDto, { data: any }>(getApiPaths().updateTransfer_ + id),
    onSuccess() {
      toast.success('Перемещение успешно обновлено')
      queryClient.refetchQueries(ApiKeys.WarehouseReports.getTransfers)
      queryClient.refetchQueries([ApiKeys.WarehouseReports.getTransfer_ + id])
      navigate(RouterPaths.warehouse + '?report=flow')
    },
    onError(error) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data.message || 'Произошла ошибка при обновлении перемещения',
        )
      }
    },
  })
}

