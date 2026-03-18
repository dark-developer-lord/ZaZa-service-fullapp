import { useQuery } from 'react-query'

import { useCashFlowFilterStore } from '@features/analytic/cash-flow/filter-orders'
import { getApiPaths, ApiKeys, getQuery } from '@shared/api'

import { dtoToQuery } from './filter-dto'

interface TransactionTotalsResponse {
  total_income: number
  total_expense: number
}

export const useGetTransactionsTotal = () => {
  const {
    searchValue,
    type,
    category_id,
    subcategory_id,
    date,
  } = useCashFlowFilterStore()
  
  const params: { [key: string]: string } = {}
  
  if (searchValue.trim()) {
    params.search = searchValue
  }
  
  const searchParams = new URLSearchParams(params)
  const filterParams = dtoToQuery({
    type,
    category_id,
    subcategory_id,
    date
  })
  
  let url = `${getApiPaths().countTransactionTotals}?${searchParams.toString()}`
  if (filterParams.toString()) {
    url += `&${filterParams.toString()}`
  }

  return useQuery({
    queryFn: getQuery<TransactionTotalsResponse>(url),
    queryKey: [ApiKeys.CashFlow.countTransactionTotals, url],
    keepPreviousData: true,
  })
}
