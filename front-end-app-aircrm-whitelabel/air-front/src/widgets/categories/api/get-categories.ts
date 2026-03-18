import { useQuery } from 'react-query'

import { CategoryItem } from '@entities/category'
import { ApiKeys, DataPagination, getApiPaths, getQuery } from '@shared/api'

import { useStore } from '../model/store'

// Remove Function param perPage
export const useGetCategories = (perPage?: number) => {
  const { paginationModel, searchValue } = useStore()
  const params: { [key: string]: string } = {
    page: (paginationModel.page + 1).toString(),
    per_page: perPage?.toString() || paginationModel.pageSize.toString(),
  }
  if (searchValue.trim()) {
    params.search = searchValue
  }
  const searchParams = new URLSearchParams(params)
  const url = `${getApiPaths().getCategories}?${searchParams.toString()}`

  return useQuery({
    queryFn: getQuery<DataPagination<CategoryItem>>(url),
    queryKey: [ApiKeys.Categories.getCategories, url],
    keepPreviousData: true,
  })
}
