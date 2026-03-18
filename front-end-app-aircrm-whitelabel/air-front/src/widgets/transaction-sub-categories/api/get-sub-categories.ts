import { useQuery } from 'react-query'

import { TransactionSubCategoryItem } from '@entities/transaction-sub-categories'
import { ApiKeys, DataPagination, getApiPaths, getQuery } from '@shared/api'

import { useStore } from '../model/store'

export const useGetSubCategories = () => {
  const { paginationModel, searchValue } = useStore()
  const params: { [key: string]: string } = {
    page: (paginationModel.page + 1).toString(),
    per_page: paginationModel.pageSize.toString(),
  }
  if (searchValue.trim()) {
    params.search = searchValue
  }
  const searchParams = new URLSearchParams(params)
  const url = `${getApiPaths().getTransactionSubCategories}?${searchParams.toString()}`

  return useQuery({
    queryFn: getQuery<DataPagination<TransactionSubCategoryItem>>(url),
    queryKey: [ApiKeys.CashFlow.getTransactionSubCategories_, url],
    keepPreviousData: true,
  })
}
