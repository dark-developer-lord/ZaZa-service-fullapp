import { useQuery } from 'react-query'

import { ArrivalItem } from '@entities/warehouse/model/warehouse'
import { ApiKeys, DataPagination, getApiPaths, getQuery } from '@shared/api'

import { useStore } from '../model/store'

export const useGetArrivals = () => {
  const { paginationModel, searchValue } = useStore()
  const params: { [key: string]: string } = {
    page: (paginationModel.page + 1).toString(),
    per_page: paginationModel.pageSize.toString(),
  }
  if (searchValue.trim()) {
    params.search = searchValue
  }
  const searchParams = new URLSearchParams(params)

  const url = `${getApiPaths().getReceipts}?${searchParams.toString()}`

  return useQuery({
      queryKey: [ApiKeys.WarehouseReports.getReceipts, url],
      queryFn: getQuery<DataPagination<ArrivalItem>>(url),
      keepPreviousData: false,
  })
}