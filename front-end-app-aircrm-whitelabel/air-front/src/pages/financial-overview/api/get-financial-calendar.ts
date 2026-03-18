import { useQuery } from 'react-query'

import { ApiKeys, getApiPaths, getQuery } from '@shared/api'
import { useProfile } from '@shared/auth'

export interface DayFinancialData {
  date: string
  income: number
  expense: number
  installment: number
  net: number
  fact: number
  has_transaction: boolean
}

export interface MonthlyFinancialResponse {
  opening_balance: number
  month: string
  days: DayFinancialData[]
}

export const useGetFinancialCalendar = (year: number, month: number) => {
  const source = useProfile((profile) => profile.source)

  const monthKey = `${year}-${String(month).padStart(2, '0')}`

  return useQuery({
    queryKey: [ApiKeys.CashFlow.getFinancialCalendar_, monthKey, source],
    queryFn: getQuery<MonthlyFinancialResponse>(`${getApiPaths().getFinancialCalendar_}${monthKey}`),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    keepPreviousData: true,
    staleTime: 2 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
  })
}
