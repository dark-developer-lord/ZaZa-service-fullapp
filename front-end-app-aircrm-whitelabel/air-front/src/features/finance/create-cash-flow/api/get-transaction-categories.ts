import { useQuery } from 'react-query'

import { ApiKeys, getApiPaths, getQuery } from '@shared/api'
import { TransactionCategoryItem } from '@entities/transaction-category'

export const useGetTransactionCategories = () => {
  return useQuery({
    queryKey: [ApiKeys.CashFlow.getTransactionCategories],
    queryFn: getQuery<{ data: TransactionCategoryItem[]}>(getApiPaths().getTransactionCategoriesList),
    refetchOnMount: false,
  })
}