import { useMutation } from 'react-query'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { AxiosError } from 'axios'

import { ApiKeys, postQuery, queryClient, getApiPaths } from '@shared/api'
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

export interface WalletDto {
  id: number
  amount: number
}

export interface CreateTransferDto {
  name?: string
  transfer_type: string
  from_warehouse_id: number
  to_warehouse_id?: number
  to_vendor_id?: number
  products: TransferProductDto[]
  wallets?: WalletDto[]
  is_installment?: boolean
  initial_payment?: number
  due_date?: string
  total_due?: number
  remaining_balance?: number
}

export const useCreateTransfer = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationKey: [ApiKeys.WarehouseReports.createTransfer],
    mutationFn: postQuery<CreateTransferDto, { data: any }>(getApiPaths().createTransfer),
    onSuccess() {
      toast.success('Перемещение успешно создано')
      queryClient.refetchQueries(ApiKeys.WarehouseReports.getTransfers)
      navigate(RouterPaths.warehouse + '?report=flow')
    },
    onError(error) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data.message || 'Произошла ошибка при создании перемещения',
        )
      }
    },
  })
}

