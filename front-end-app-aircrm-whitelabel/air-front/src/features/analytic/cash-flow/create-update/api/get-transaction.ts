import { useQuery } from 'react-query'
import { ApiKeys, getApiPaths, getQuery } from '@shared/api'
import { TransactionTypeItem } from '@widgets/finance/ui/cash-flow-table/columns'

interface TransactionApiResponse {
  data: {
    name: string
    description: string
    wallet?: {
      id: number
      name: string
    }
    wallets?: Array<{
      id: number
      name: string
    }>
    category: {
      id: number
      name: string
    }
    subcategory: {
      id: number
      name: string
    } | null
    type: "income" | "expense"
    transaction_number: number
    created_at: string
    amount: string
  }
}

export const useGetTransaction = (transactionId: number | null) => {
  return useQuery<{ data: TransactionTypeItem }>({
    queryKey: [ApiKeys.CashFlow.getTransaction_ + transactionId],
    queryFn: async () => {
      const response = await getQuery<TransactionApiResponse>(getApiPaths().getTransaction_ + transactionId)()
      // Transform API response to match TransactionTypeItem structure
      const wallets = response.data.wallets || (response.data.wallet ? [response.data.wallet] : [])
      return {
        data: {
          id: transactionId!,
          transaction_number: response.data.transaction_number,
          name: response.data.name,
          description: response.data.description,
          category_id: response.data.category.id,
          subcategory_id: response.data.subcategory?.id || null,
          type: response.data.type,
          amount: response.data.amount,
          status: 'success' as const, // API doesn't return status, defaulting
          created_at: response.data.created_at,
          wallet_id: wallets[0]?.id, // For backward compatibility
          wallets: wallets,
          category: response.data.category,
          subcategory: response.data.subcategory,
        }
      }
    },
    enabled: !!transactionId,
    refetchOnMount: false,
    keepPreviousData: false,
  })
}
