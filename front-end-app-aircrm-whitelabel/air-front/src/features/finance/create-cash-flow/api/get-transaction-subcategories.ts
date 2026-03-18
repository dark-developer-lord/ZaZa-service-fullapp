import { useQuery } from 'react-query'

import { ApiKeys, getApiPaths, getQuery } from '@shared/api'

interface CatagoryItem {
    id: number
    name: string
}

export const useGetTransactionSubCategories = (categoryId: number) => {
  return useQuery({
    queryKey: [ApiKeys.CashFlow.getTransactionSubCategories_, categoryId],
    queryFn: getQuery<{ data: CatagoryItem[]}>(getApiPaths().getTransactionSubcategories_ + categoryId),
    enabled: Boolean(categoryId),
  })
}