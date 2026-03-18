import { useQuery } from 'react-query'
import { getQuery, getApiPaths, ApiKeys } from '@shared/api'

export interface Wallet {
  wallet_id: number
  name: string
  logo: string | null
  is_enabled: boolean
  vendor_wallet_id: number | null
  transaction_count: number
  transaction_share_percent: number
  total_amount: number
  type?: string
}

interface WalletsResponse {
  wallets: Wallet[]
  fact: number
}

export const useGetWallets = () => {
  return useQuery({
    queryKey: [ApiKeys.CashFlow.getWallets],
    queryFn: getQuery<WalletsResponse>(getApiPaths().getWallets),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 2 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
  })
}
