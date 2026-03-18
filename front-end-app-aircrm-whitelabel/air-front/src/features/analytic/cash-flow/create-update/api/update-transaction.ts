import { useMutation } from 'react-query'
import { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { ApiKeys, getApiPaths, putQuery, queryClient } from '@shared/api'
import { CreateCashFlowDto } from '@features/finance'

export const useUpdateTransaction = (transactionId: number | null, onSuccess?: () => void) => {
  return useMutation({
    mutationKey: [ApiKeys.CashFlow.updateTransaction_ + transactionId],
    mutationFn: (dto: CreateCashFlowDto) => {
      const formData = new FormData()
      formData.append('type', dto.type.toString())
      
      // Use subcategory_id if it exists and is a valid number > 0, otherwise use category_id
      const subcategoryId = dto.subcategory_id
      const categoryId = dto.category_id
      
      // Simple check: if subcategory_id is a number and > 0, use it
      if (subcategoryId != null && Number(subcategoryId) > 0) {
        formData.append("transaction_category_id", String(subcategoryId))
      } else if (categoryId != null) {
        formData.append("transaction_category_id", String(categoryId))
      }
      // Support both wallet_id (single) and wallet_ids (array)
      if (dto.wallet_ids && Array.isArray(dto.wallet_ids) && dto.wallet_ids.length > 0) {
        dto.wallet_ids.forEach((walletId) => {
          formData.append("wallet_ids[]", walletId.toString())
        })
      } else if (dto.wallet_id) {
        formData.append("wallet_id", dto.wallet_id.toString())
      }
      formData.append("name", dto.name)
      formData.append("amount", dto.amount.toString())
      if (dto.description) {
        formData.append("description", dto.description)
      }
      return putQuery(getApiPaths().updateTransaction_ + transactionId)(formData)
    },
    onSuccess() {
      toast.success("Транзакция успешно обновлена")
      queryClient.refetchQueries(ApiKeys.CashFlow.getTransactions)
      queryClient.refetchQueries(ApiKeys.CashFlow.getMonthlyFinanceStatistic)
      queryClient.refetchQueries(ApiKeys.CashFlow.getWallets)
      queryClient.refetchQueries(ApiKeys.CashFlow.getFinancialCalendar_)
      onSuccess?.()
    },
    onError(error) {
      if (error instanceof AxiosError) {
        toast.error(
          error.response?.data.message || 'Произошла ошибка при обновлении',
        )
      }
    },
  })
}
