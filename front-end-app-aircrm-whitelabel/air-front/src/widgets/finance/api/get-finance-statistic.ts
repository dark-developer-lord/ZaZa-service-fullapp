import { useQuery } from 'react-query'

import { ApiKeys, getApiPaths, getQuery } from '@shared/api'

interface FinanceStatistic {
  today_income: string
  week_income: string
  month_income: string
  year_income: string
}

export const useGetFinanceStatistic= () => {
  return useQuery({
    queryKey: [ApiKeys.CashFlow.getFinanceStatistic],
    queryFn: getQuery<FinanceStatistic>(getApiPaths().getFinanceStatistic),
    refetchOnMount: false,
  })
}