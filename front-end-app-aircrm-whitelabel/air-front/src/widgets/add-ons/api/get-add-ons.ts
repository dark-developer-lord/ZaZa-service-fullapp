import { useQuery } from 'react-query'

import { AddOn } from '@entities/add-on'
import { ApiKeys, DataPagination, getApiPaths, getQuery } from '@shared/api'

import { useStore } from '../model/store'

export const useGetAddOns = () => {
  const { paginationModel, searchValue } = useStore()
  const params: { [key: string]: string } = {
    page: (paginationModel.page + 1).toString(),
    per_page: paginationModel.pageSize.toString(),
  }
  if (searchValue.trim()) {
    params.search = searchValue
  }
  const searchParams = new URLSearchParams(params)
  const url = `${getApiPaths().getAddOns}?${searchParams.toString()}`

  return useQuery({
    queryKey: [ApiKeys.AddOns.getAddOns, url],
    queryFn: getQuery<DataPagination<AddOn>>(url),
    keepPreviousData: true,
  })
}
