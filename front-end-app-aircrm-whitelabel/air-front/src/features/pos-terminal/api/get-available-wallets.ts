import { useQuery } from 'react-query'
import { getQuery, getApiPaths, ApiKeys } from '@shared/api'

export interface AvailableWallet {
  wallet_id: number
  vendor_wallet_id: number
  name: string
  logo: string | null
  is_enabled: boolean
  type: string | null
  transaction_count: number
  transaction_share_percent: number
  total_amount: number
}

interface AvailableWalletsResponse {
  wallets: AvailableWallet[]
  fact: number
}

export const useGetAvailableWallets = () => {
  return useQuery({
    queryKey: [ApiKeys.CashFlow.getAvailableWallets],
    queryFn: getQuery<AvailableWalletsResponse>(getApiPaths().getAvailableWallets),
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  })
}
