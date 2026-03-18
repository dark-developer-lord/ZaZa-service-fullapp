import { useQuery } from 'react-query'
import { ApiKeys, getApiPaths, getQuery, DataPagination } from '@shared/api'
import { TransferItem } from '@entities/warehouse'
import { useIncomingTransferStore } from '../model/incoming-transfers-store'

export const useGetIncomingTransfers = () => {
  const { paginationModel, searchValue } = useIncomingTransferStore()
  const params: { [key: string]: string } = {
    page: (paginationModel.page + 1).toString(),
    per_page: paginationModel.pageSize.toString(),
  }
  if (searchValue.trim()) {
    params.search = searchValue
  }
  const searchParams = new URLSearchParams(params)

  const url = `${getApiPaths().getIncomingTransfers}?${searchParams.toString()}`

  return useQuery({
      queryKey: [ApiKeys.WarehouseReports.getIncomingTransfers, url],
      queryFn: getQuery<DataPagination<TransferItem>>(url),
      keepPreviousData: false,
  })
}

