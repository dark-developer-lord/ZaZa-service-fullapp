import { useQuery } from 'react-query'

import { ApiKeys, getApiPaths, getQuery } from '@shared/api'
import { useProfile } from '@shared/auth'

export interface TransactionApproval {
  id: number
  title: string
  description: string | null
  amount: string
  transaction_type: string
  transaction_type_label: string
  cycle_type: string
  cycle_type_label: string
  category: string
  wallet: string
  wallet_id: number | null
  counterparty_id: number
  transaction_category_id: number
  created_at: string
  can_approve: boolean
  approval_date: string
}

export interface TransactionApprovalsSummary {
  income_count: number
  expense_count: number
  dividends_count: number
  total_income_amount: number
  total_expense_amount: number
  total_dividends_amount: number
}

export interface TransactionApprovalsResponse {
  date: string
  approvals: TransactionApproval[]
  total_count: number
  summary: TransactionApprovalsSummary
}

export const useGetTransactionApprovals = (date: string | null) => {
  const source = useProfile((profile) => profile.source)

  return useQuery({
    queryKey: [ApiKeys.CashFlow.getTransactionApprovals, date, source],
    queryFn: getQuery<TransactionApprovalsResponse>(`${getApiPaths().getTransactionApprovals}?date=${date}`),
    enabled: !!date,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  })
}

