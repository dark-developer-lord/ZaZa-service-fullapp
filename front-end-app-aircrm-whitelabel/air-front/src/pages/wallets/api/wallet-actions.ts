import { useMutation, useQueryClient } from 'react-query'
import toast from 'react-hot-toast'
import { AxiosError } from 'axios'

import { api, ApiKeys } from '@shared/api'

interface WalletActionDto {
  wallet_id: number
}

interface WalletActionResponse {
  message: string
  success: boolean
}

interface CreateWalletDto {
  name: string
  logo?: File
}

interface CreateWalletResponse {
  message: string
  success: boolean
  wallet?: any
}

// Activate wallet
export const useActivateWallet = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (dto: WalletActionDto): Promise<WalletActionResponse> => {
      const response = await api.post('/vendor/finance/wallets/activate', dto)
      return response.data
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Кошелек успешно активирован')
      // Refetch wallets data
      queryClient.invalidateQueries([ApiKeys.CashFlow.getWallets])
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || 'Ошибка при активации кошелька')
      } else {
        toast.error('Произошла ошибка при активации кошелька')
      }
    }
  })
}

// Deactivate wallet
export const useDeactivateWallet = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (dto: WalletActionDto): Promise<WalletActionResponse> => {
      const response = await api.post('/vendor/finance/wallets/deactivate', dto)
      return response.data
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Кошелек успешно деактивирован')
      // Refetch wallets data
      queryClient.invalidateQueries([ApiKeys.CashFlow.getWallets])
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || 'Ошибка при деактивации кошелька')
      } else {
        toast.error('Произошла ошибка при деактивации кошелька')
      }
    }
  })
}

// Create new wallet
export const useCreateWallet = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (dto: CreateWalletDto): Promise<CreateWalletResponse> => {
      const formData = new FormData()
      formData.append('name', dto.name)
      if (dto.logo) {
        formData.append('logo', dto.logo)
      }

      const response = await api.post('vendor/transaction/wallets', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Кошелек успешно создан')
      // Refetch wallets data
      queryClient.invalidateQueries([ApiKeys.CashFlow.getWallets])
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || 'Ошибка при создании кошелька')
      } else {
        toast.error('Произошла ошибка при создании кошелька')
      }
    }
  })
}
