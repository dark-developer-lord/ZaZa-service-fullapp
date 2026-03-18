import { useQuery } from 'react-query'

import { ApiKeys, getApiPaths, getQuery } from '@shared/api'

interface TransactionsItem {
    month: string
    month_key: string
    total: string
}
interface Statistic {
  income: TransactionsItem & {
    percentage: number
  }[]
  expence: TransactionsItem[]
}

export const useGetMonthlyFinanceStatistic= () => {
  return useQuery({
    queryKey: [ApiKeys.CashFlow.getMonthlyFinanceStatistic],
    queryFn: getQuery<Statistic>(getApiPaths().getMonthlyFinanceStatistic),
    refetchOnMount: false,
  })
}