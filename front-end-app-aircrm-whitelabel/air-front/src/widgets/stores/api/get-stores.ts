import { useQuery } from 'react-query'

import { StoreItem } from '@entities/stores'

import { Api, ApiKeys, DataPagination, getQuery } from '@shared/api'

import { useStore } from '../model/store'


export const useGetStores = () => {
  const { paginationModel, searchValue } = useStore()
  const params: { [key: string]: string } = {
    page: (paginationModel.page + 1).toString(),
    per_page: paginationModel.pageSize.toString(),
  }
  if (searchValue.trim()) {
    params.search = searchValue
  }
  const searchParams = new URLSearchParams(params)
  const url = `${Api.getStores}?${searchParams.toString()}`

  return useQuery({
    queryKey: [ApiKeys.Stores.getStores, url],
    queryFn: getQuery<DataPagination<StoreItem>>(url),
    keepPreviousData: true,
  })
}
