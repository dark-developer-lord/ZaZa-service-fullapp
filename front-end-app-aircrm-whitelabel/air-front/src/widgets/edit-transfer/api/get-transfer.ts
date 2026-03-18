import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'

import { ApiKeys, getApiPaths, getQuery } from '@shared/api'
import { TransferItem } from '@entities/warehouse'

export const useGetTransfer = () => {
  const params = useParams()
  const id = params.id

  return useQuery({
    queryKey: [ApiKeys.WarehouseReports.getTransfer_ + id],
    queryFn: getQuery<{ data: TransferItem }>(getApiPaths().getTransfer_ + id),
    enabled: !!id,
    refetchOnMount: false,
    keepPreviousData: false,
  })
}

