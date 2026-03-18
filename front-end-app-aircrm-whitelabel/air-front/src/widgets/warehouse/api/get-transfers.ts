import { useQuery } from 'react-query'

import { TransferItem } from '@entities/warehouse/model/warehouse'
import { ApiKeys, DataPagination, getApiPaths, getQuery } from '@shared/api'

import { useTransferStore } from '../model/transfers-store'

export const useGetTransfers = () => {
  const { paginationModel, searchValue } = useTransferStore()
  const params: { [key: string]: string } = {
    page: (paginationModel.page + 1).toString(),
    per_page: paginationModel.pageSize.toString(),
  }
  if (searchValue.trim()) {
    params.search = searchValue
  }
  const searchParams = new URLSearchParams(params)

  const url = `${getApiPaths().getTransfers}?${searchParams.toString()}`

  return useQuery({
      queryKey: [ApiKeys.WarehouseReports.getTransfers, url],
      queryFn: getQuery<DataPagination<TransferItem>>(url),
      keepPreviousData: false,
  })
}

