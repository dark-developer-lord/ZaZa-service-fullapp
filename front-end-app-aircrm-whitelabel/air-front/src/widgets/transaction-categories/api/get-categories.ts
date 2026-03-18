import { useQuery } from 'react-query'

import { TransactionCategoryItem } from '@entities/transaction-category'
import { ApiKeys, DataPagination, getApiPaths, getQuery } from '@shared/api'

import { useStore } from '../model/store'

export const useGetCategories = () => {
  const { paginationModel, searchValue } = useStore()
  const params: { [key: string]: string } = {
    page: (paginationModel.page + 1).toString(),
    per_page: paginationModel.pageSize.toString(),
  }
  if (searchValue.trim()) {
    params.search = searchValue
  }
  const searchParams = new URLSearchParams(params)
  const url = `${getApiPaths().getTransactionCategories}?${searchParams.toString()}`

  return useQuery({
    queryFn: getQuery<DataPagination<TransactionCategoryItem>>(url),
    queryKey: [ApiKeys.CashFlow.getTransactionCategories, url],
    keepPreviousData: true,
  })
}
