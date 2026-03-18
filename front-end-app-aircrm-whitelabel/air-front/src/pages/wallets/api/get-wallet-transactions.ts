import { useQuery } from 'react-query'
import { getQuery } from '@shared/api'

export interface WalletTransaction {
  id: number
  amount: number
  status: string
  reference: string | null
  paid_at: string | null
  created_at: string
  source: string
  description: string
  wallet: {
    id: number
    name: string
    logo: string
  }
  transaction?: {
    id: number
    name: string
    type: 'income' | 'expense'
  }
  order?: {
    id: number
    order_number: number
  }
  meta: {
    source: string
    transaction_type?: 'income' | 'expense'
    transaction_name?: string
  }
}

export interface WalletTransactionsResponse {
  data: WalletTransaction[]
  meta: {
    current_page: number
    from: number
    last_page: number
    per_page: number
    to: number
    total: number
  }
}

export const useGetWalletTransactions = (walletId: number | null, enabled: boolean = true) => {
  return useQuery<WalletTransactionsResponse>(
    ['wallet-transactions', walletId],
    getQuery(`/vendor/transaction/wallet-transactions?wallet_id=${walletId}`),
    {
      enabled: enabled && walletId !== null,
    }
  )
}

