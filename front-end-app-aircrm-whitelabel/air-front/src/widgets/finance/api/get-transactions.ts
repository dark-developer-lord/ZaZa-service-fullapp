import { useQuery } from 'react-query'

import { TransactionTypeItem } from '../ui/cash-flow-table/columns'
import { ApiKeys, DataPagination, getApiPaths, getQuery } from '@shared/api'

import { useCashFlowFilterStore } from '@features/analytic/cash-flow/filter-orders'
import { dtoToQuery } from './filter-dto'

export const useGetTransactions = () => {
  const { searchValue, type, category_id, subcategory_id, date, paginationModel } = useCashFlowFilterStore()
  const params: { [key: string]: string } = {
    page: (paginationModel.page + 1).toString(),
    per_page: paginationModel.pageSize.toString(),
  }
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
  
  let url = `${getApiPaths().getTransactions}?${searchParams.toString()}`

  if (filterParams.toString()) {
    url += `&${filterParams.toString()}`
  }


  return useQuery({
      queryKey: [ApiKeys.CashFlow.getTransactions, paginationModel.page, paginationModel.pageSize, searchValue, type, category_id, subcategory_id, date],
      queryFn: async () => {
        const response = await getQuery<DataPagination<any>>(url)()
        
        // Debug: Log first item to see actual API response structure
        if (response.data && response.data.length > 0) {
          console.log('First transaction from API:', response.data[0])
          console.log('Has id field?', 'id' in response.data[0])
          console.log('Has transaction_number?', 'transaction_number' in response.data[0])
        }
        
        // Transform API response
        // IMPORTANT: The API response MUST have an `id` field for API requests (PUT /transaction/{id})
        // transaction_number is only for visual display, NOT for API requests
        const transformedData = {
          ...response,
          data: response.data.map((item: any, index: number) => {
            // The actual id from API - this is what we use for API requests
            // Check all possible id field names
            const actualId = item.id ?? item.transaction_id ?? item._id
            
            // If id is missing, log error - this is a problem
            if (!actualId && item.transaction_number) {
              console.error('CRITICAL: Transaction missing id field! Only has transaction_number:', item.transaction_number, 'Full item:', item)
            }
            
            // For DataGrid row identification, use id if available, otherwise fallback
            const gridId = actualId ?? item.transaction_number ?? `txn_${item.transaction_number ?? index}`
            
            return {
              ...item,
              // CRITICAL: id must be the actual API id, not transaction_number
              // If actualId is still undefined here, the API response structure needs to be fixed
              id: actualId || gridId,
              category_id: item.category_id ?? item.category?.id ?? null,
              subcategory_id: item.subcategory_id ?? item.subcategory?.id ?? null,
              wallet_id: item.wallet_id ?? item.wallet?.id ?? (item.wallets?.[0]?.id) ?? null,
              status: item.status ?? 'success', // Default status if not provided
            }
          })
        }
        return transformedData as DataPagination<TransactionTypeItem>
      },
      keepPreviousData: true,
  })
}