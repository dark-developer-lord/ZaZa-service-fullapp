import { useQuery } from 'react-query'

import { ApiKeys, getApiPaths, getQuery } from '@shared/api'

interface TransactionItem {
    value: string | number  // Backend can return either string or number
    label: string
}

export const useGetTransactionType = () => {
  return useQuery({
    queryKey: [ApiKeys.CashFlow.getTransactionTypes],
    queryFn: getQuery<{ data: TransactionItem[] }>(getApiPaths().getTransactionTypes),
    refetchOnMount: false,
  })
}