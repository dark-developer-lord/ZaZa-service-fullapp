import { useQuery } from 'react-query'

import { Courier } from '@entities/courier'
import { ApiKeys, DataPagination, getApiPaths, getQuery } from '@shared/api'

import { useStore } from '../model/store'

export const useGetCouriers = () => {
  const { paginationModel, searchValue } = useStore()
  const params: { [key: string]: string } = {
    page: (paginationModel.page + 1).toString(),
    per_page: paginationModel.pageSize.toString(),
  }
  if (searchValue.trim()) {
    params.search = searchValue
  }
  const searchParams = new URLSearchParams(params)
  const url = `${getApiPaths().getCouriers}?${searchParams.toString()}`

  return useQuery({
    queryKey: [ApiKeys.Couriers.getCouriers, url],
    queryFn: getQuery<DataPagination<Courier>>(url),
    keepPreviousData: true,
  })
}
