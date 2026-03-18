import { useQuery } from 'react-query'

import { SubCategory } from '@entities/sub-category'
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
  const url = `${getApiPaths().getSubCategories}?${searchParams.toString()}`

  return useQuery({
    queryFn: getQuery<DataPagination<SubCategory>>(url),
    queryKey: [ApiKeys.Categories.getSubCategories, url],
    keepPreviousData: true,
  })
}
