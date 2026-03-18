import { useQuery } from 'react-query'

import { ApiKeys, getApiPaths, getQuery } from '@shared/api'
import { useProfile } from '@shared/auth'

// Schedule item for each transaction type
export interface ScheduleItem {
  id: number
  amount: number
  counterparty: string
  cycle_type: string
  is_approved: boolean
}

// Transaction type data (income, expense, dividends)
export interface TransactionTypeSchedule {
  count: number
  approved_count: number
  total_amount: number
  schedules: ScheduleItem[]
}

// Day schedule data
export interface DayScheduleData {
  date: string  // "2025-10-12"
  income: TransactionTypeSchedule
  expense: TransactionTypeSchedule
  dividends: TransactionTypeSchedule
  total_schedules: number
  unapproved_count: number
  has_unapproved: boolean
  net_amount: number
}

export interface ScheduledTransactionsTotal {
  income_total: number
  expense_total: number
  completed_total: number
  not_completed_total: number
}

export interface ScheduledTransactionsCalendarResponse {
  calendar: DayScheduleData[]
  total: ScheduledTransactionsTotal
}

// Hook for fetching scheduled transactions calendar
export const useGetScheduledTransactionsCalendar = (year: number, month: number, enabled: boolean = true) => {
  const source = useProfile((profile) => profile.source)

  // Format month as YYYY-MM (e.g., "2025-10")
  const monthKey = `${year}-${String(month).padStart(2, '0')}`

  return useQuery({
    queryKey: [ApiKeys.CashFlow.getScheduledTransactionsCalendar_, monthKey, source],
    queryFn: getQuery<ScheduledTransactionsCalendarResponse>(`${getApiPaths().getScheduledTransactionsCalendar_}${monthKey}`),
    enabled,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    keepPreviousData: true,
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
  })
}

